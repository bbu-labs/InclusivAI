import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv, SupportedCountry, SupportedLanguage } from "../types";
import { requireAuth } from "../middleware/auth";
import { ANALYSIS_TYPES, SIMPLIFICATION_LEVELS } from "../types";
import { createMistralClient } from "../services/mistral";
import { analyzeDocument } from "../agents/pipeline";
import { generateAudio } from "../agents/audio";
import { askQuestion } from "../agents/questions";

const analyze = new Hono<AppEnv>();

analyze.use("*", requireAuth);

const analyzeSchema = z.object({
  analysis_type: z.enum([...ANALYSIS_TYPES, "auto"]).default("auto"),
  simplification_level: z.enum(SIMPLIFICATION_LEVELS).default("medio"),
});

// POST /api/analyze/:documentId — run analysis pipeline
analyze.post(
  "/:documentId",
  zValidator("json", analyzeSchema),
  async (c) => {
    const user = c.get("user")!;
    const documentId = c.req.param("documentId");
    const { analysis_type, simplification_level } = c.req.valid("json");
    const supabaseAdmin = c.get("supabaseAdmin");

    // Check rate limit and fetch country/language
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("plan, analyses_this_month, month_reset_at, country, language")
      .eq("id", user.id)
      .single();

    const userCountry: SupportedCountry = (profile?.country as SupportedCountry) || "BR";
    const userLanguage: SupportedLanguage = (profile?.language as SupportedLanguage) || "pt-BR";

    if (profile) {
      const limit = profile.plan === "premium" ? 100 : 10;
      const monthReset = new Date(profile.month_reset_at);
      const count = monthReset <= new Date() ? 0 : profile.analyses_this_month;

      if (count >= limit) {
        return c.json(
          {
            error: "RATE_LIMIT_EXCEEDED",
            detail: `${count}/${limit}`,
          },
          429
        );
      }
    }

    // Fetch document
    const { data: doc, error: docError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .single();

    if (docError || !doc) {
      return c.json({ error: "DOCUMENT_NOT_FOUND" }, 404);
    }

    const isFileUpload = doc.source_type === "pdf_upload" || doc.source_type === "image_upload";
    if (!isFileUpload && !doc.raw_text) {
      return c.json({ error: "DOCUMENT_NO_TEXT" }, 400);
    }
    if (isFileUpload && !doc.file_path) {
      return c.json({ error: "DOCUMENT_NO_FILE" }, 400);
    }

    const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);

    const result = await analyzeDocument(
      {
        sourceType: doc.source_type,
        content: doc.raw_text || "",
        filePath: doc.file_path || undefined,
        userId: user.id,
        documentId,
        simplificationLevel: simplification_level,
        analysisType: analysis_type === "auto" ? "general" : analysis_type,
        country: userCountry,
      },
      mistralClient,
      supabaseAdmin
    );

    return c.json({ analysis: result }, 201);
  }
);

// GET /api/analyze/:analysisId — get analysis result
analyze.get("/:analysisId", async (c) => {
  const user = c.get("user")!;
  const analysisId = c.req.param("analysisId");
  const supabaseAdmin = c.get("supabaseAdmin");

  const { data, error } = await supabaseAdmin
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return c.json({ error: "ANALYSIS_NOT_FOUND" }, 404);
  }

  return c.json({ analysis: data });
});

// POST /api/analyze/:analysisId/audio — generate audio for existing analysis
analyze.post("/:analysisId/audio", async (c) => {
  const user = c.get("user")!;
  const analysisId = c.req.param("analysisId");
  const supabaseAdmin = c.get("supabaseAdmin");

  // Fetch analysis
  const { data: analysis, error } = await supabaseAdmin
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (error || !analysis) {
    return c.json({ error: "ANALYSIS_NOT_FOUND" }, 404);
  }

  // Return cached audio if it exists
  if (analysis.audio_url) {
    return c.json({ audio: { audioUrl: analysis.audio_url, cached: true } });
  }

  // Fetch user language for TTS voice selection
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("language")
    .eq("id", user.id)
    .single();

  const userLanguage: SupportedLanguage = (profile?.language as SupportedLanguage) || "pt-BR";

  // Build audio text from summary
  const summary = analysis.summary as Record<string, unknown>;
  let audioText = "";

  if (summary.resumo) {
    audioText += summary.resumo + "\n\n";
  }
  if (summary.resumo_executivo) {
    audioText += summary.resumo_executivo + "\n\n";
  }
  if (summary.explicacao) {
    audioText += summary.explicacao + "\n\n";
  }
  if (summary.recomendacao) {
    audioText += summary.recomendacao + "\n\n";
  }
  if (summary.acao_recomendada) {
    audioText += summary.acao_recomendada + "\n\n";
  }
  if (Array.isArray(summary.pontos_criticos)) {
    for (const ponto of summary.pontos_criticos as Array<{ item: string; explicacao: string }>) {
      audioText += `${ponto.item}: ${ponto.explicacao}\n`;
    }
  }

  if (!audioText.trim()) {
    return c.json({ error: "ANALYSIS_NO_AUDIO_CONTENT" }, 400);
  }

  const kvCache = "INCLUSIVAI_CACHE" in c.env ? (c.env as Record<string, unknown>).INCLUSIVAI_CACHE as KVNamespace : undefined;

  let result;
  try {
    result = await generateAudio(
      audioText.trim(),
      analysisId,
      supabaseAdmin,
      kvCache,
      c.env.ELEVENLABS_API_KEY,
      userLanguage
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (/ElevenLabs API error.*401/.test(message)) {
      if (/quota|credit|billing|subscription/i.test(message)) {
        return c.json({ error: "AUDIO_QUOTA_EXCEEDED", detail: message, fallback: true }, 402);
      }
      return c.json({ error: "AUDIO_AUTH_ERROR", detail: message, fallback: true }, 401);
    }

    if (/ElevenLabs API error.*422/.test(message) && /quota|credit|billing|subscription/i.test(message)) {
      return c.json({ error: "AUDIO_QUOTA_EXCEEDED", detail: message, fallback: true }, 402);
    }

    if (/ElevenLabs API error.*429/.test(message)) {
      return c.json({ error: "AUDIO_RATE_LIMIT", detail: message, fallback: true }, 429);
    }

    if (message.includes("Failed to upload audio")) {
      return c.json({ error: "AUDIO_UPLOAD_ERROR", detail: message }, 500);
    }

    return c.json({ error: "AUDIO_SERVICE_ERROR", detail: message, fallback: true }, 502);
  }

  // Update analysis with audio URL
  await supabaseAdmin
    .from("analyses")
    .update({ audio_url: result.audioUrl })
    .eq("id", analysisId);

  return c.json({ audio: result }, 201);
});

const questionSchema = z.object({
  question: z.string().min(3).max(500),
});

// POST /api/analyze/:analysisId/ask — ask a question about the analysis
analyze.post(
  "/:analysisId/ask",
  zValidator("json", questionSchema),
  async (c) => {
    const user = c.get("user")!;
    const analysisId = c.req.param("analysisId");
    const { question } = c.req.valid("json");
    const supabaseAdmin = c.get("supabaseAdmin");

    // Fetch analysis
    const { data: analysis, error: aErr } = await supabaseAdmin
      .from("analyses")
      .select("id, summary, document_id, user_id")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (aErr || !analysis) {
      return c.json({ error: "ANALYSIS_NOT_FOUND" }, 404);
    }

    // Fetch document raw_text separately to avoid join ambiguity
    const { data: doc } = await supabaseAdmin
      .from("documents")
      .select("raw_text")
      .eq("id", analysis.document_id)
      .single();

    // Fetch user country
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("country")
      .eq("id", user.id)
      .single();

    const userCountry: SupportedCountry = (profile?.country as SupportedCountry) || "BR";

    const documentText = doc?.raw_text || "";
    const summaryStr = JSON.stringify(analysis.summary);

    console.log("[QA] analysis:", analysisId, "| docText length:", documentText.length, "| summaryStr length:", summaryStr.length);

    const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);

    let result;
    try {
      result = await askQuestion(question, documentText, summaryStr, mistralClient, userCountry);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[QA] Unexpected error for analysis", analysisId, ":", detail);
      return c.json({ error: "QA_FAILED", detail }, 502);
    }

    if (!result.success || !result.data) {
      console.error("[QA] Agent failed for analysis", analysisId, ":", result.error);
      return c.json({ error: "QA_FAILED", detail: result.error }, 502);
    }

    // Save to questions table
    const { data: saved, error: saveErr } = await supabaseAdmin
      .from("questions")
      .insert({
        analysis_id: analysisId,
        user_id: user.id,
        question,
        answer: result.data.answer,
        source_excerpt: result.data.source_excerpt,
      })
      .select("id, question, answer, source_excerpt, created_at")
      .single();

    if (saveErr) {
      return c.json({ question: result.data });
    }

    return c.json({ question: saved }, 201);
  }
);

// GET /api/analyze/:analysisId/questions — list previous Q&A
analyze.get("/:analysisId/questions", async (c) => {
  const user = c.get("user")!;
  const analysisId = c.req.param("analysisId");
  const supabaseAdmin = c.get("supabaseAdmin");

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id, question, answer, source_excerpt, created_at")
    .eq("analysis_id", analysisId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return c.json({ error: "QA_LIST_ERROR" }, 500);
  }

  return c.json({ questions: data });
});

export default analyze;
