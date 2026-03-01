import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { createMistralClient, MINISTRAL_8B, MISTRAL_LARGE, type MistralClient } from "../services/mistral";
import { DOC_GEN_TYPES, DOC_GEN_SYSTEM_PROMPT, DOC_GEN_USER_PROMPT, type DocGenType } from "../prompts/document-gen";
import { DOC_CLASSIFY_PROMPT } from "../prompts/reader";
import { isUrl, fetchUrlContent } from "../services/url-fetcher";
import { extractTextFromPdf } from "../services/pdf";

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

// POST /api/documents/text — submit pasted text or URL
documents.post("/text", zValidator("json", createTextDocSchema), async (c) => {
  const user = c.get("user")!;
  const { title, doc_type } = c.req.valid("json");
  let { raw_text } = c.req.valid("json");
  const supabaseAdmin = c.get("supabaseAdmin");

  // If raw_text is a URL, fetch the page content
  let sourceType: "text_input" | "url_import" = "text_input";
  if (isUrl(raw_text)) {
    const result = await fetchUrlContent(raw_text);
    if (!result.ok) {
      return c.json({ error: "Erro ao acessar URL", detail: result.error }, 400);
    }
    raw_text = result.text;
    sourceType = "url_import";
  }

  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({
      user_id: user.id,
      title,
      raw_text,
      doc_type,
      source_type: sourceType,
    })
    .select("id, title, doc_type, source_type, created_at")
    .single();

  if (error) {
    return c.json({ error: "Erro ao salvar documento" }, 500);
  }

  // Classify doc_type before responding so the UI shows the correct type
  const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);
  const classified = await classifyAndUpdate(supabaseAdmin, mistralClient, data.id, raw_text);
  if (classified) {
    data.doc_type = classified.doc_type;
    if (classified.title) data.title = classified.title;
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
  const safeName = file.name.normalize("NFD").replace(/[^\w.-]/g, "_");
  const filePath = `${user.id}/${Date.now()}_${safeName}`;

  // Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from("uploads")
    .upload(filePath, fileBuffer, { contentType, upsert: true });

  if (uploadError) {
    console.error("[UPLOAD ERROR]", uploadError.message, uploadError);
    return c.json({ error: "Erro ao fazer upload do arquivo", detail: uploadError.message }, 500);
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
    console.error("[DB INSERT ERROR]", error.message, error);
    return c.json({ error: "Erro ao salvar documento", detail: error.message }, 500);
  }

  // For text-extractable PDFs, classify doc_type before responding
  if (isPdf) {
    const { text, needsOcr } = await extractTextFromPdf(fileBuffer);
    if (!needsOcr && text.length > 0) {
      const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);
      const classified = await classifyAndUpdate(supabaseAdmin, mistralClient, data.id, text);
      if (classified) {
        data.doc_type = classified.doc_type;
        if (classified.title) data.title = classified.title;
      }
    }
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

// Classify document type using a lightweight LLM call.
// Returns the updated fields, or null if classification fails.
async function classifyAndUpdate(
  supabase: SupabaseClient,
  mistralClient: MistralClient,
  docId: string,
  text: string
): Promise<{ doc_type: string; title: string } | null> {
  try {
    const snippet = text.slice(0, 2000);
    const { data } = await mistralClient.chatJSON<{
      tipo_documento: string;
      titulo: string;
    }>(
      MINISTRAL_8B,
      [
        { role: "system", content: DOC_CLASSIFY_PROMPT },
        { role: "user", content: snippet },
      ],
      256
    );

    const validTypes = [
      "termos_de_uso",
      "contrato",
      "notificacao_judicial",
      "carta_inss",
      "mensagem_suspeita",
      "outro",
    ];
    const docType = validTypes.includes(data.tipo_documento)
      ? data.tipo_documento
      : "outro";

    const title = data.titulo?.slice(0, 200) || "";
    const updates: Record<string, string> = { doc_type: docType };
    if (title.length > 0) {
      updates.title = title;
    }

    await supabase.from("documents").update(updates).eq("id", docId);
    return { doc_type: docType, title: title || docId };
  } catch (err) {
    console.error("[CLASSIFY ERROR]", err);
    return null;
  }
}

const docGenSchema = z.object({
  type: z.enum(DOC_GEN_TYPES),
  nome: z.string().optional(),
  cpf: z.string().optional(),
  empresa: z.string().min(1, "Nome da empresa é obrigatório"),
  problema: z.string().min(10, "Descreva o problema com mais detalhes"),
  data_ocorrencia: z.string().optional(),
  valor: z.string().optional(),
  tentativas_anteriores: z.string().optional(),
  pedido: z.string().optional(),
});

// POST /api/documents/:documentId/generate — generate legal document
documents.post(
  "/:documentId/generate",
  zValidator("json", docGenSchema),
  async (c) => {
    const user = c.get("user")!;
    const documentId = c.req.param("documentId");
    const body = c.req.valid("json");
    const supabaseAdmin = c.get("supabaseAdmin");

    // Fetch analysis for this document (if any) to provide context
    let analysisContext: string | undefined;
    const { data: analysis } = await supabaseAdmin
      .from("analyses")
      .select("summary")
      .eq("document_id", documentId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (analysis?.summary) {
      analysisContext = JSON.stringify(analysis.summary);
    }

    const mistralClient = createMistralClient(c.env.MISTRAL_API_KEY);

    const userPrompt = DOC_GEN_USER_PROMPT(
      body.type as DocGenType,
      {
        nome: body.nome,
        cpf: body.cpf,
        empresa: body.empresa,
        problema: body.problema,
        data_ocorrencia: body.data_ocorrencia,
        valor: body.valor,
        tentativas_anteriores: body.tentativas_anteriores,
        pedido: body.pedido,
      },
      analysisContext
    );

    const result = await mistralClient.chatJSON<{
      documento: string;
      tipo: string;
      instrucoes: string;
    }>(
      MISTRAL_LARGE,
      [
        { role: "system", content: DOC_GEN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      4096
    );

    return c.json({ generated: result.data }, 201);
  }
);

export default documents;
