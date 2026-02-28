import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { ANALYSIS_TYPES, SIMPLIFICATION_LEVELS } from "../types";
import { createMistralClient } from "../services/mistral";
import { analyzeDocument } from "../agents/pipeline";
import { generateAudio } from "../agents/audio";

const analyze = new Hono<AppEnv>();

analyze.use("*", requireAuth);

const analyzeSchema = z.object({
  analysis_type: z.enum(ANALYSIS_TYPES).default("tos"),
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

    // Check rate limit: 10 analyses/month for free tier
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("plan, analyses_this_month, month_reset_at")
      .eq("id", user.id)
      .single();

    if (profile) {
      const limit = profile.plan === "premium" ? 100 : 10;
      const monthReset = new Date(profile.month_reset_at);
      const count = monthReset <= new Date() ? 0 : profile.analyses_this_month;

      if (count >= limit) {
        return c.json(
          {
            error: "Limite de análises atingido",
            detail: `Você já usou ${count}/${limit} análises este mês`,
            suggestion: "Aguarde o próximo mês ou faça upgrade para o plano premium",
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
      return c.json({ error: "Documento não encontrado" }, 404);
    }

    // For text_input, raw_text must exist; for file uploads, file_path must exist
    const isFileUpload = doc.source_type === "pdf_upload" || doc.source_type === "image_upload";
    if (!isFileUpload && !doc.raw_text) {
      return c.json({ error: "Documento sem texto para analisar" }, 400);
    }
    if (isFileUpload && !doc.file_path) {
      return c.json({ error: "Arquivo do documento não encontrado" }, 400);
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
        analysisType: analysis_type,
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
    return c.json({ error: "Análise não encontrada" }, 404);
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
    return c.json({ error: "Análise não encontrada" }, 404);
  }

  // Return cached audio if it exists
  if (analysis.audio_url) {
    return c.json({ audio: { audioUrl: analysis.audio_url, cached: true } });
  }

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
    audioText += "Recomendação: " + summary.recomendacao + "\n\n";
  }
  if (summary.acao_recomendada) {
    audioText += "Ação recomendada: " + summary.acao_recomendada + "\n\n";
  }
  if (Array.isArray(summary.pontos_criticos)) {
    for (const ponto of summary.pontos_criticos as Array<{ item: string; explicacao: string }>) {
      audioText += `${ponto.item}: ${ponto.explicacao}\n`;
    }
  }

  if (!audioText.trim()) {
    return c.json({ error: "Análise sem conteúdo para gerar áudio" }, 400);
  }

  const kvCache = "CACHE" in c.env ? (c.env as Record<string, unknown>).CACHE as KVNamespace : undefined;

  const result = await generateAudio(
    audioText.trim(),
    analysisId,
    supabaseAdmin,
    kvCache,
    c.env.ELEVENLABS_API_KEY
  );

  // Update analysis with audio URL
  await supabaseAdmin
    .from("analyses")
    .update({ audio_url: result.audioUrl })
    .eq("id", analysisId);

  return c.json({ audio: result }, 201);
});

export default analyze;
