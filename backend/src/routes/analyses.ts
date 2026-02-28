import { Hono } from "hono";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";

const analyses = new Hono<AppEnv>();

// All routes require authentication
analyses.use("*", requireAuth);

// GET / — List user's analyses with document info
analyses.get("/", async (c) => {
  const user = c.get("user")!;
  const supabaseAdmin = c.get("supabaseAdmin");

  const { data, error } = await supabaseAdmin
    .from("analyses")
    .select("id, analysis_type, abuse_score, summary, created_at, documents(title, doc_type)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: "Erro ao buscar análises" }, 500);
  }

  const analyses_list = (data ?? []).map((row: Record<string, unknown>) => {
    const summary = row.summary as Record<string, unknown>;
    const docs = row.documents as unknown as { title: string; doc_type: string } | null;

    // Extract first 150 chars from whichever summary field exists
    const rawPreview = (summary?.resumo || summary?.resumo_executivo || summary?.explicacao || "") as string;
    const summaryPreview = rawPreview.length > 150 ? rawPreview.slice(0, 147) + "..." : rawPreview;

    return {
      id: row.id,
      documentTitle: docs?.title || "Documento analisado",
      documentType: docs?.doc_type || "outro",
      analysisType: row.analysis_type,
      abuseScore: row.abuse_score,
      summaryPreview,
      createdAt: row.created_at,
    };
  });

  return c.json({ analyses: analyses_list });
});

export default analyses;
