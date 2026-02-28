import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "./types";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import documentRoutes from "./routes/documents";
import analyzeRoutes from "./routes/analyze";
import rankingRoutes from "./routes/ranking";
import shareRoutes from "./routes/share";
import demoRoutes from "./routes/demo";
import docsRoutes from "./routes/docs";

const app = new Hono<AppEnv>();

// CORS
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://clausula-oculta.pages.dev",
      "https://clausula-oculta.bmtec.workers.dev",
      "https://inclusivai.bbu.app.br",
      "https://clausulaoculta.com.br",
      "https://www.clausulaoculta.com.br",
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  })
);

// API docs (public, before auth middleware)
app.route("/api/docs", docsRoutes);

// Auth middleware on all /api routes
app.use("/api/*", authMiddleware);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/documents", documentRoutes);
app.route("/api/analyze", analyzeRoutes);
app.route("/api/ranking", rankingRoutes);
app.route("/api/share", shareRoutes);
app.route("/api/demo", demoRoutes);

// Global error handler
app.onError((err, c) => {
  console.error(`[ERROR] ${c.req.method} ${c.req.path}:`, err);

  // Hono HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      { error: err.message, detail: err.cause },
      err.status
    );
  }

  const message = err instanceof Error ? err.message : String(err);

  // Zod validation errors
  if (message.includes("Validation") || message.includes("parse")) {
    return c.json(
      { error: "Dados inválidos", detail: message, suggestion: "Verifique os campos enviados" },
      400
    );
  }

  // Mistral API errors
  if (message.includes("Mistral") || message.includes("mistral") || message.includes("429")) {
    return c.json(
      { error: "O serviço de IA está temporariamente indisponível", detail: "Tente novamente em alguns instantes", suggestion: "Se o problema persistir, tente com um documento menor" },
      502
    );
  }

  // Supabase errors
  if (message.includes("supabase") || message.includes("PostgrestError")) {
    return c.json(
      { error: "Erro ao acessar o banco de dados", detail: "Tente novamente em alguns instantes" },
      500
    );
  }

  return c.json(
    { error: "Erro interno do servidor", detail: "Tente novamente em alguns instantes" },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Rota não encontrada" }, 404);
});

export default app;
