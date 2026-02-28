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

// POST /api/documents/upload — file upload (PDF or image)
documents.post("/upload", async (c) => {
  const user = c.get("user")!;
  const supabaseAdmin = c.get("supabaseAdmin");

  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || !(file instanceof File)) {
    return c.json({ error: "Arquivo é obrigatório" }, 400);
  }

  // Validate file size (5MB limit)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return c.json(
      { error: "Arquivo muito grande", detail: "Tamanho máximo: 5MB" },
      400
    );
  }

  // Detect content type
  const contentType = file.type;
  const isPdf = contentType === "application/pdf";
  const isImage = contentType.startsWith("image/");

  if (!isPdf && !isImage) {
    return c.json(
      { error: "Tipo de arquivo não suportado", detail: "Envie PDF ou imagem (JPG, PNG)" },
      400
    );
  }

  const sourceType = isPdf ? "pdf_upload" : "image_upload";
  const filePath = `uploads/${user.id}/${Date.now()}_${file.name}`;

  // Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from("uploads")
    .upload(filePath, fileBuffer, { contentType });

  if (uploadError) {
    return c.json({ error: "Erro ao fazer upload do arquivo" }, 500);
  }

  // Save document record
  const title = (body["title"] as string) || file.name.replace(/\.[^.]+$/, "");

  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({
      user_id: user.id,
      title,
      source_type: sourceType,
      file_path: filePath,
      file_size_bytes: file.size,
    })
    .select("id, title, doc_type, source_type, file_path, created_at")
    .single();

  if (error) {
    return c.json({ error: "Erro ao salvar documento" }, 500);
  }

  return c.json({ document: data }, 201);
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
