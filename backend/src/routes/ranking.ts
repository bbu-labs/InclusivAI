import { Hono } from "hono";
import type { AppEnv } from "../types";
import { createSupabaseAdmin } from "../services/supabase";

const ranking = new Hono<AppEnv>();

// GET /api/ranking — public, list companies by avg abuse score
ranking.get("/", async (c) => {
  const supabaseAdmin = createSupabaseAdmin(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabaseAdmin
    .from("company_rankings")
    .select("id, company_name, avg_abuse_score, total_analyses, last_analysis_at")
    .order("avg_abuse_score", { ascending: false });

  if (error) {
    return c.json({ error: "Erro ao buscar ranking" }, 500);
  }

  return c.json({ rankings: data });
});

// GET /api/ranking/:company — company detail with top issues
ranking.get("/:company", async (c) => {
  const companyName = decodeURIComponent(c.req.param("company"));
  const supabaseAdmin = createSupabaseAdmin(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabaseAdmin
    .from("company_rankings")
    .select("*")
    .eq("company_name", companyName)
    .single();

  if (error || !data) {
    return c.json({ error: "Empresa não encontrada no ranking" }, 404);
  }

  return c.json({ company: data });
});

export default ranking;
