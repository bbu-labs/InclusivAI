import { supabase } from "./supabase";
import type {
  ApiDocument,
  ApiProfile,
  ApiSession,
  ApiAnalysis,
  ApiPipelineResult,
  ApiQuestion,
  ApiRanking,
  ApiShareCard,
  AnalysisType,
  SimplificationLevel,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// ─── Error class ───

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// ─── Base request helper ───

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    return { Authorization: `Bearer ${data.session.access_token}` };
  }
  return {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData?: boolean
): Promise<T> {
  const headers: Record<string, string> = {
    ...(await getAuthHeader()),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, json.error || json.message || "Erro desconhecido");
  }

  return json as T;
}

// ─── Auth ───

export async function apiSignup(email: string, password: string, full_name?: string) {
  return request<{ user: { id: string; email: string }; session: ApiSession }>(
    "POST",
    "/api/auth/signup",
    { email, password, full_name }
  );
}

export async function apiLogin(email: string, password: string) {
  return request<{ user: { id: string; email: string }; session: ApiSession }>(
    "POST",
    "/api/auth/login",
    { email, password }
  );
}

export async function apiLogout() {
  return request<{ message: string }>("POST", "/api/auth/logout");
}

export async function apiGetMe() {
  return request<{ profile: ApiProfile }>("GET", "/api/auth/me");
}

export async function apiUpdateProfile(updates: Partial<ApiProfile>) {
  return request<{ profile: ApiProfile }>("PATCH", "/api/auth/profile", updates);
}

// ─── Documents ───

export async function apiCreateTextDocument(title: string, raw_text: string, doc_type?: string) {
  return request<{ document: ApiDocument }>("POST", "/api/documents/text", {
    title,
    raw_text,
    doc_type: doc_type || "outro",
  });
}

export async function apiUploadFile(file: File, title?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  return request<{ document: ApiDocument }>("POST", "/api/documents/upload", formData, true);
}

export async function apiListDocuments() {
  return request<{ documents: ApiDocument[] }>("GET", "/api/documents");
}

export async function apiGetDocument(id: string) {
  return request<{ document: ApiDocument }>("GET", `/api/documents/${id}`);
}

export async function apiDeleteDocument(id: string) {
  return request<{ message: string }>("DELETE", `/api/documents/${id}`);
}

// ─── Analyze ───

export async function apiRunAnalysis(
  documentId: string,
  analysisType: AnalysisType = "tos",
  simplificationLevel: SimplificationLevel = "medio"
) {
  return request<{ analysis: ApiPipelineResult }>(
    "POST",
    `/api/analyze/${documentId}`,
    { analysis_type: analysisType, simplification_level: simplificationLevel }
  );
}

export async function apiGetAnalysis(analysisId: string) {
  return request<{ analysis: ApiAnalysis }>("GET", `/api/analyze/${analysisId}`);
}

export async function apiGenerateAudio(analysisId: string) {
  return request<{ audio: { audioUrl: string; cached?: boolean } }>(
    "POST",
    `/api/analyze/${analysisId}/audio`
  );
}

export async function apiAskQuestion(analysisId: string, question: string) {
  return request<{ question: ApiQuestion }>(
    "POST",
    `/api/analyze/${analysisId}/ask`,
    { question }
  );
}

export async function apiGetQuestions(analysisId: string) {
  return request<{ questions: ApiQuestion[] }>(
    "GET",
    `/api/analyze/${analysisId}/questions`
  );
}

// ─── Ranking ───

export async function apiGetRanking() {
  return request<{ rankings: ApiRanking[] }>("GET", "/api/ranking");
}

// ─── Share ───

export async function apiGetShareHash(analysisId: string) {
  return request<{ hash: string; shareUrl: string }>(
    "GET",
    `/api/share/${analysisId}/hash`
  );
}

export async function apiGetShareCard(analysisId: string, hash: string) {
  return request<{ card: ApiShareCard }>(
    "GET",
    `/api/share/${analysisId}/card?hash=${hash}`
  );
}
