// ─── Input method (frontend only) ───
export type InputMethod = "url" | "camera" | "file";

// ─── Backend enums ───
export type DocType =
  | "termos_de_uso"
  | "contrato"
  | "notificacao_judicial"
  | "carta_inss"
  | "mensagem_suspeita"
  | "outro";

export type SourceType = "text_input" | "pdf_upload" | "image_upload" | "url_import";
export type AnalysisType = "tos" | "scam" | "general";
export type SimplificationLevel = "fundamental" | "medio" | "tecnico";
export type PreferredOutput = "text" | "audio" | "both";
export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
export type EducationLevel = "fundamental" | "medio" | "superior" | "pos_graduacao";
export type UserPlan = "free" | "premium";

// ─── API response shapes ───

export interface ApiDocument {
  id: string;
  title: string;
  doc_type: DocType;
  source_type: SourceType;
  file_path?: string;
  created_at: string;
}

export interface ApiProfile {
  id: string;
  email: string;
  full_name: string | null;
  age_range: AgeRange | null;
  education_level: EducationLevel | null;
  preferred_output: PreferredOutput;
  font_size: number;
  high_contrast: boolean;
  plan: UserPlan;
  analyses_this_month: number;
  month_reset_at: string;
  created_at: string;
}

export interface ApiSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ─── Analysis summary types (polymorphic) ───

export interface TosAnalysisSummary {
  abusividade: number;
  resumo: string;
  clausulas_abusivas: Array<{
    texto_original: string;
    explicacao_simples: string;
    artigo_cdc: string;
    gravidade: "alta" | "media" | "baixa";
  }>;
  pontos_positivos: string[];
  recomendacao: string;
}

export interface ScamDetectionSummary {
  classificacao: "golpe_provavel" | "suspeito" | "aparentemente_legitimo";
  confianca: number;
  sinais_alerta: string[];
  explicacao: string;
  acao_recomendada: string;
  onde_denunciar: Array<{
    orgao: string;
    como: string;
    contato: string;
  }>;
}

export interface GeneralSummary {
  resumo_executivo: string;
  pontos_criticos: Array<{
    item: string;
    explicacao: string;
    urgencia: "alta" | "media" | "baixa";
  }>;
  acoes_recomendadas: Array<{
    acao: string;
    prazo: string;
    como_fazer: string;
  }>;
  prazos: Array<{
    descricao: string;
    data_limite: string;
    consequencia: string;
  }>;
  base_legal: Array<{
    lei: string;
    artigo: string;
    relevancia: string;
  }>;
}

export type AnalysisSummary = TosAnalysisSummary | ScamDetectionSummary | GeneralSummary;

export interface ApiAnalysis {
  id: string;
  document_id: string;
  user_id: string;
  analysis_type: AnalysisType;
  simplification_level: SimplificationLevel;
  abuse_score: number | null;
  summary: AnalysisSummary;
  audio_url: string | null;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  duration_ms: number;
  model_used: string;
  created_at: string;
}

// Pipeline result returned by POST /api/analyze/:documentId
export interface ApiPipelineResult {
  analysisId: string;
  summary: AnalysisSummary;
  abuseScore: number | null;
  tokensUsed: { input: number; output: number };
  costUsd: number;
  durationMs: number;
}

// ─── Q&A ───
export interface ApiQuestion {
  id: string;
  question: string;
  answer: string;
  source_excerpt: string | null;
  created_at: string;
}

// ─── Ranking ───
export interface ApiRanking {
  id: string;
  company_name: string;
  avg_abuse_score: number;
  total_analyses: number;
  last_analysis_at: string;
}

// ─── Share ───
export interface ApiShareCard {
  analysisId: string;
  documentTitle: string;
  documentType: DocType;
  analysisType: AnalysisType;
  abuseScore: number | null;
  resumo: string | null;
  createdAt: string;
}

// ─── Analysis list item (from /api/analyses) ───

export interface ApiAnalysisListItem {
  id: string;
  documentTitle: string;
  documentType: string;
  analysisType: AnalysisType;
  abuseScore: number | null;
  summaryPreview: string;
  createdAt: string;
}

export const ANALYSIS_TYPE_LABELS: Record<AnalysisType, string> = {
  tos: "Termos de Uso",
  scam: "Detecção de Golpe",
  general: "Análise Geral",
};

// ─── UI helper type ───

export interface AnalysisDisplay {
  analysisId: string;
  analysisType: AnalysisType;
  protectionScore: number; // 0-100, computed from abuse_score
  summary: AnalysisSummary;
  audioUrl: string | null;
}

/** Convert backend abuse_score (0-10, higher=worse) to UI protectionScore (0-100, higher=better) */
export function computeProtectionScore(abuseScore: number | null): number {
  if (abuseScore === null) return 50;
  return Math.round((1 - abuseScore / 10) * 100);
}

// ─── App State ───

export interface AppState {
  inputMethod: InputMethod | null;
  rawInput: string | null;
  fileName: string | null;
  documentId: string | null;
  analysisId: string | null;
  document: ApiDocument | null;
  analysisDisplay: AnalysisDisplay | null;
}

// ─── Doc type labels (for UI) ───
export const DOC_TYPE_LABELS: Record<DocType, string> = {
  termos_de_uso: "Termos de Uso",
  contrato: "Contrato",
  notificacao_judicial: "Notificação Judicial",
  carta_inss: "Carta do INSS",
  mensagem_suspeita: "Mensagem Suspeita",
  outro: "Outro Documento",
};

// ─── Gravidade helpers ───
export type Gravidade = "alta" | "media" | "baixa";

export function getGravidadeColor(g: Gravidade) {
  switch (g) {
    case "alta": return "text-error";
    case "media": return "text-warning";
    case "baixa": return "text-success";
  }
}

export function getGravidadeBadge(g: Gravidade) {
  switch (g) {
    case "alta": return "badge-error";
    case "media": return "badge-warning";
    case "baixa": return "badge-success";
  }
}

export function getGravidadeLabel(g: Gravidade) {
  switch (g) {
    case "alta": return "Alta";
    case "media": return "Média";
    case "baixa": return "Baixa";
  }
}
