import { Hono } from "hono";
import type { AppEnv } from "../types";

const demo = new Hono<AppEnv>();

// GET /api/demo — list available demo entries
demo.get("/", async (c) => {
  const kv = "INCLUSIVAI_CACHE" in c.env ? (c.env as Record<string, unknown>).INCLUSIVAI_CACHE as KVNamespace : undefined;

  if (!kv) {
    return c.json({ error: "Cache não configurado" }, 503);
  }

  const index = await kv.get("demo:index", "json");
  if (!index) {
    return c.json({ demos: [] });
  }

  return c.json({ demos: index });
});

// GET /api/demo/:key — get a specific demo entry (e.g., demo:tos:instagram)
demo.get("/:category/:slug", async (c) => {
  const category = c.req.param("category");
  const slug = c.req.param("slug");
  const key = `demo:${category}:${slug}`;

  const kv = "INCLUSIVAI_CACHE" in c.env ? (c.env as Record<string, unknown>).INCLUSIVAI_CACHE as KVNamespace : undefined;

  if (!kv) {
    return c.json({ error: "Cache não configurado" }, 503);
  }

  const data = await kv.get(key, "json");
  if (!data) {
    return c.json({ error: "Demo não encontrado" }, 404);
  }

  return c.json({ demo: data });
});

export default demo;
