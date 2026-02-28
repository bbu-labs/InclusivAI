import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { ANALYSIS_TYPES, SIMPLIFICATION_LEVELS } from "../types";
import { createMistralClient } from "../services/mistral";
import { analyzeDocument } from "../agents/pipeline";

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

    if (!doc.raw_text) {
      return c.json({ error: "Documento sem texto para analisar" }, 400);
    }

    const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);

    const result = await analyzeDocument(
      {
        sourceType: doc.source_type,
        content: doc.raw_text,
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

export default analyze;
