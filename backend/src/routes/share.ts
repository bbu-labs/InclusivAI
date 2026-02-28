import { Hono } from "hono";
import type { AppEnv } from "../types";
import { createSupabaseAdmin } from "../services/supabase";
import { createMistralClient } from "../services/mistral";
import { generateSocialSummary, renderShareCardSvg } from "../services/share-image";

const share = new Hono<AppEnv>();

/**
 * Generate HMAC-SHA256 share hash for an analysis ID.
 * This allows public access to specific analyses without auth.
 */
async function generateShareHash(analysisId: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(analysisId));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyShareHash(
  analysisId: string,
  hash: string,
  secret: string
): Promise<boolean> {
  const expected = await generateShareHash(analysisId, secret);
  return hash === expected;
}

// GET /api/share/:analysisId/card?hash=xxx — public analysis summary for card rendering
share.get("/:analysisId/card", async (c) => {
  const analysisId = c.req.param("analysisId");
  const hash = c.req.query("hash");

  if (!hash) {
    return c.json({ error: "Hash de compartilhamento necessário" }, 400);
  }

  const valid = await verifyShareHash(analysisId, hash, c.env.SHARE_HASH_SECRET);
  if (!valid) {
    return c.json({ error: "Link de compartilhamento inválido" }, 403);
  }

  const supabaseAdmin = createSupabaseAdmin(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: analysis, error } = await supabaseAdmin
    .from("analyses")
    .select("id, analysis_type, abuse_score, summary, created_at, documents(title, doc_type)")
    .eq("id", analysisId)
    .single();

  if (error || !analysis) {
    return c.json({ error: "Análise não encontrada" }, 404);
  }

  const summary = analysis.summary as Record<string, unknown>;
  const docs = analysis.documents as unknown as Array<{ title: string; doc_type: string }> | null;
  const doc = docs?.[0] ?? null;

  return c.json({
    card: {
      analysisId: analysis.id,
      documentTitle: doc?.title || "Documento analisado",
      documentType: doc?.doc_type || "outro",
      analysisType: analysis.analysis_type,
      abuseScore: analysis.abuse_score,
      resumo: summary.resumo || summary.resumo_executivo || summary.explicacao || null,
      createdAt: analysis.created_at,
    },
  });
});

// GET /api/share/:analysisId/og?hash=xxx — Open Graph metadata for social preview
share.get("/:analysisId/og", async (c) => {
  const analysisId = c.req.param("analysisId");
  const hash = c.req.query("hash");

  if (!hash) {
    return c.json({ error: "Hash de compartilhamento necessário" }, 400);
  }

  const valid = await verifyShareHash(analysisId, hash, c.env.SHARE_HASH_SECRET);
  if (!valid) {
    return c.json({ error: "Link de compartilhamento inválido" }, 403);
  }

  const supabaseAdmin = createSupabaseAdmin(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: analysis, error } = await supabaseAdmin
    .from("analyses")
    .select("id, analysis_type, abuse_score, summary, documents(title)")
    .eq("id", analysisId)
    .single();

  if (error || !analysis) {
    return c.json({ error: "Análise não encontrada" }, 404);
  }

  const summary = analysis.summary as Record<string, unknown>;
  const docs2 = analysis.documents as unknown as Array<{ title: string }> | null;
  const doc = docs2?.[0] ?? null;
  const title = doc?.title || "Análise de documento";
  const score = analysis.abuse_score;

  let description = "";
  if (analysis.analysis_type === "tos" && score !== null) {
    description = `Nota de abusividade: ${score}/10. `;
  }
  description += (summary.resumo || summary.resumo_executivo || summary.explicacao || "") as string;
  // Truncate for OG
  if (description.length > 200) {
    description = description.slice(0, 197) + "...";
  }

  return c.json({
    og: {
      title: `InclusivAI — ${title}`,
      description,
      type: "article",
      url: `https://inclusivai.com.br/share/${analysisId}?hash=${hash}`,
    },
  });
});

// GET /api/share/:analysisId/image?hash=xxx — public, render share card SVG
// Frontend converts SVG → PNG via canvas for sharing
share.get("/:analysisId/image", async (c) => {
  const analysisId = c.req.param("analysisId");
  const hash = c.req.query("hash");

  if (!hash) {
    return c.json({ error: "Hash de compartilhamento necessário" }, 400);
  }

  const valid = await verifyShareHash(analysisId, hash, c.env.SHARE_HASH_SECRET);
  if (!valid) {
    return c.json({ error: "Link de compartilhamento inválido" }, 403);
  }

  // Check KV cache
  const cacheKey = `share-svg:${analysisId}`;
  const cached = await c.env.INCLUSIVAI_CACHE.get(cacheKey, "text");
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=604800",
      },
    });
  }

  // Fetch analysis data
  const supabaseAdmin = createSupabaseAdmin(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: analysis, error } = await supabaseAdmin
    .from("analyses")
    .select("id, analysis_type, abuse_score, summary, created_at, documents(title, doc_type)")
    .eq("id", analysisId)
    .single();

  if (error || !analysis) {
    return c.json({ error: "Análise não encontrada" }, 404);
  }

  const summary = analysis.summary as Record<string, unknown>;
  const docs = analysis.documents as unknown as { title: string; doc_type: string } | null;
  const documentTitle = docs?.title || "Documento analisado";
  const rawSummary = (summary.resumo || summary.resumo_executivo || summary.explicacao || "") as string;
  const abuseScore = analysis.abuse_score as number | null;
  const protectionScore = abuseScore !== null ? Math.round((1 - abuseScore / 10) * 100) : 50;

  // Generate social summary via Mistral
  const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);
  let socialSummary: string;
  try {
    socialSummary = await generateSocialSummary(
      mistralClient,
      analysis.analysis_type as string,
      abuseScore,
      rawSummary
    );
  } catch {
    socialSummary = rawSummary.length > 120 ? rawSummary.slice(0, 117) + "..." : rawSummary;
  }

  // Render SVG (pure string template, no WASM)
  const svg = renderShareCardSvg({
    documentTitle,
    analysisType: analysis.analysis_type as string,
    protectionScore,
    socialSummary,
    date: analysis.created_at as string,
  });

  // Cache SVG in KV (7-day TTL)
  c.executionCtx.waitUntil(
    c.env.INCLUSIVAI_CACHE.put(cacheKey, svg, { expirationTtl: 7 * 24 * 60 * 60 })
  );

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800",
    },
  });
});

// GET /api/share/:analysisId/hash — authenticated, generate share hash for own analysis
share.get("/:analysisId/hash", async (c) => {
  const analysisId = c.req.param("analysisId");
  const hash = await generateShareHash(analysisId, c.env.SHARE_HASH_SECRET);
  return c.json({ hash, shareUrl: `/api/share/${analysisId}/card?hash=${hash}` });
});

export default share;
