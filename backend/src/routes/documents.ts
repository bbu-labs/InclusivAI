import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";

const documents = new Hono<AppEnv>();

// All document routes require auth
documents.use("*", requireAuth);

const createTextDocSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  raw_text: z.string().min(10, "Texto deve ter no mínimo 10 caracteres").max(100000),
  doc_type: z
    .enum(["termos_de_uso", "contrato", "notificacao_judicial", "carta_inss", "mensagem_suspeita", "outro"])
    .optional()
    .default("outro"),
});

// POST /api/documents/text — submit pasted text
documents.post("/text", zValidator("json", createTextDocSchema), async (c) => {
  const user = c.get("user")!;
  const { title, raw_text, doc_type } = c.req.valid("json");
  const supabaseAdmin = c.get("supabaseAdmin");

  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({
      user_id: user.id,
      title,
      raw_text,
      doc_type,
      source_type: "text_input",
    })
    .select("id, title, doc_type, source_type, created_at")
    .single();

  if (error) {
    return c.json({ error: "Erro ao salvar documento" }, 500);
  }

  return c.json({ document: data }, 201);
});

// GET /api/documents — list user's documents
documents.get("/", async (c) => {
  const user = c.get("user")!;
  const supabase = c.get("supabase");

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, doc_type, source_type, created_at")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: "Erro ao listar documentos" }, 500);
  }

  return c.json({ documents: data });
});

// GET /api/documents/:id — get single document
documents.get("/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  const supabase = c.get("supabase");

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .single();

  if (error || !data) {
    return c.json({ error: "Documento não encontrado" }, 404);
  }

  return c.json({ document: data });
});

// DELETE /api/documents/:id — soft delete
documents.delete("/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  const supabaseAdmin = c.get("supabaseAdmin");

  const { error } = await supabaseAdmin
    .from("documents")
    .update({ is_deleted: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return c.json({ error: "Erro ao excluir documento" }, 500);
  }

  return c.json({ message: "Documento excluído com sucesso" });
});

export default documents;
