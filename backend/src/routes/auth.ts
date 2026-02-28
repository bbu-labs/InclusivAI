import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "../types";
import { requireAuth } from "../middleware/auth";
import { AGE_RANGES, EDUCATION_LEVELS, PREFERRED_OUTPUTS } from "../types";

const auth = new Hono<AppEnv>();

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  full_name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  age_range: z.enum(AGE_RANGES).optional(),
  education_level: z.enum(EDUCATION_LEVELS).optional(),
  preferred_output: z.enum(PREFERRED_OUTPUTS).optional(),
  font_size: z.number().min(12).max(32).optional(),
  high_contrast: z.boolean().optional(),
});

// POST /api/auth/signup
auth.post("/signup", zValidator("json", signupSchema), async (c) => {
  const { email, password, full_name } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({
    user: { id: data.user?.id, email: data.user?.email },
    session: data.session,
  }, 201);
});

// POST /api/auth/login
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  return c.json({
    user: { id: data.user.id, email: data.user.email },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
});

// POST /api/auth/logout
auth.post("/logout", requireAuth, async (c) => {
  const supabase = c.get("supabase");
  await supabase.auth.signOut();
  return c.json({ message: "Logout realizado com sucesso" });
});

// GET /api/auth/me
auth.get("/me", requireAuth, async (c) => {
  const user = c.get("user")!;
  const supabase = c.get("supabase");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return c.json({ error: "Perfil não encontrado" }, 404);
  }

  return c.json({ profile });
});

// PATCH /api/auth/profile
auth.patch(
  "/profile",
  requireAuth,
  zValidator("json", profileUpdateSchema),
  async (c) => {
    const user = c.get("user")!;
    const updates = c.req.valid("json");
    const supabase = c.get("supabase");

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: "Erro ao atualizar perfil" }, 500);
    }

    return c.json({ profile });
  }
);

export default auth;
