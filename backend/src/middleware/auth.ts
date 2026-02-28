import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../types";
import { createSupabaseClient, createSupabaseAdmin } from "../services/supabase";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = c.env;

  // Always set up admin client
  const supabaseAdmin = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  c.set("supabaseAdmin", supabaseAdmin);

  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    // Anonymous access — no user, basic supabase client
    c.set("user", null);
    c.set("supabase", createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY));
    return next();
  }

  // Create client with user's token
  const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, token);
  c.set("supabase", supabase);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    c.set("user", null);
    return next();
  }

  c.set("user", {
    id: data.user.id,
    email: data.user.email!,
  });

  return next();
});

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Autenticação necessária" }, 401);
  }
  return next();
});
