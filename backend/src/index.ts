import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "./types";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";

const app = new Hono<AppEnv>();

// CORS
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// Auth middleware on all /api routes
app.use("/api/*", authMiddleware);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Routes
app.route("/api/auth", authRoutes);

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      { error: err.message, detail: err.cause },
      err.status
    );
  }

  console.error("Unhandled error:", err);
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
