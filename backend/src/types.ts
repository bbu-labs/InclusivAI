import type { SupabaseClient } from "@supabase/supabase-js";

// Cloudflare Worker Bindings
export type Bindings = {
  INCLUSIVAI_CACHE: KVNamespace;
  MISTRAL_API_KEY: string;
  ELEVENLABS_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SHARE_HASH_SECRET: string;
};

// Hono context variables
export type Variables = {
  user: UserContext | null;
  supabase: SupabaseClient;
  supabaseAdmin: SupabaseClient;
};

export type UserContext = {
  id: string;
  email: string;
};

// Enums matching Supabase
export const AGE_RANGES = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const EDUCATION_LEVELS = [
  "fundamental",
  "medio",
  "superior",
  "pos_graduacao",
] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const USER_PLANS = ["free", "premium"] as const;
export type UserPlan = (typeof USER_PLANS)[number];

export const DOC_TYPES = [
  "termos_de_uso",
  "contrato",
  "notificacao_judicial",
  "carta_inss",
  "mensagem_suspeita",
  "outro",
] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const SOURCE_TYPES = [
  "text_input",
  "pdf_upload",
  "image_upload",
  "url_import",
  "audio_input",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SIMPLIFICATION_LEVELS = [
  "fundamental",
  "medio",
  "tecnico",
] as const;
export type SimplificationLevel = (typeof SIMPLIFICATION_LEVELS)[number];

export const ANALYSIS_TYPES = ["tos", "scam", "general"] as const;
export type AnalysisType = (typeof ANALYSIS_TYPES)[number];

export const PREFERRED_OUTPUTS = ["text", "audio", "both"] as const;
export type PreferredOutput = (typeof PREFERRED_OUTPUTS)[number];

// App type shorthand
export type AppEnv = { Bindings: Bindings; Variables: Variables };
