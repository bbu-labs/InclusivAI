# InclusivAI — Frontend Integration Guide

This guide walks you through integrating a frontend app (React, Next.js, Vue, etc.) with the InclusivAI API.

**API Base URL:** `https://inclusive-api.bbu.app.br`
**Interactive Docs:** `https://inclusive-api.bbu.app.br/api/docs`

---

## 1. Setup

### 1.1 Install Supabase Client

The API uses Supabase Auth. Install the client library:

```bash
npm install @supabase/supabase-js
```

### 1.2 Initialize Supabase

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hofezxozpeidewiqmkzj.supabase.co",
  "YOUR_SUPABASE_ANON_KEY"
);
```

### 1.3 Create an API Helper

```typescript
const API_BASE = "https://inclusive-api.bbu.app.br";

async function api(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro desconhecido");
  }

  return data;
}
```

### 1.4 CORS

If you're running locally on `localhost:3000` or `localhost:5173`, CORS is already configured. For production, ask the backend team to add your domain to the `origin` array in `src/index.ts`.

---

## 2. Authentication Flow

### 2.1 Sign Up

```typescript
async function signup(email: string, password: string, fullName?: string) {
  const data = await api("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  // data.session contains access_token and refresh_token
  // Store the session via Supabase client for auto-refresh:
  await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  return data.user;
}
```

> After signup, the user receives a confirmation email. They must confirm before logging in.

### 2.2 Log In

```typescript
async function login(email: string, password: string) {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  return data;
}
```

### 2.3 Log Out

```typescript
async function logout() {
  await api("/api/auth/logout", { method: "POST" });
  await supabase.auth.signOut();
}
```

### 2.4 Get Current Profile

```typescript
async function getProfile() {
  const data = await api("/api/auth/me");
  return data.profile;
}
```

### 2.5 Update Profile

```typescript
async function updateProfile(updates: {
  full_name?: string;
  age_range?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
  education_level?: "fundamental" | "medio" | "superior" | "pos_graduacao";
  preferred_output?: "text" | "audio" | "both";
  font_size?: number;    // 12–32
  high_contrast?: boolean;
}) {
  const data = await api("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return data.profile;
}
```

### 2.6 Auth State Listener

Listen for session changes to update your UI:

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    // Redirect to login
  }
});
```

---

## 3. Document Management

### 3.1 Create Text Document

```typescript
async function createTextDocument(
  title: string,
  rawText: string,
  docType: "termos_de_uso" | "contrato" | "notificacao_judicial" | "carta_inss" | "mensagem_suspeita" | "outro" = "outro"
) {
  const data = await api("/api/documents/text", {
    method: "POST",
    body: JSON.stringify({ title, raw_text: rawText, doc_type: docType }),
  });
  return data.document; // { id, title, doc_type, source_type, created_at }
}
```

### 3.2 Upload File (PDF or Image)

```typescript
async function uploadDocument(file: File, title?: string) {
  // Validate on client side for better UX
  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    throw new Error("Arquivo muito grande. Máximo: 5 MB");
  }

  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Tipo de arquivo não suportado. Use PDF, JPEG ou PNG");
  }

  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);

  const data = await api("/api/documents/upload", {
    method: "POST",
    body: formData, // Don't set Content-Type — browser adds multipart boundary
  });
  return data.document;
}
```

**React example with drag & drop:**

```tsx
function FileUpload() {
  const [uploading, setUploading] = useState(false);

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const doc = await uploadDocument(file);
      console.log("Uploaded:", doc.id);
      // Navigate to analysis page
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: "2px dashed #ccc", padding: 40, textAlign: "center" }}
    >
      {uploading ? "Enviando..." : "Arraste um PDF ou imagem aqui"}
    </div>
  );
}
```

### 3.3 List Documents

```typescript
async function listDocuments() {
  const data = await api("/api/documents");
  return data.documents; // Array of { id, title, doc_type, source_type, created_at }
}
```

### 3.4 Get Document Detail

```typescript
async function getDocument(id: string) {
  const data = await api(`/api/documents/${id}`);
  return data.document;
}
```

### 3.5 Delete Document

```typescript
async function deleteDocument(id: string) {
  await api(`/api/documents/${id}`, { method: "DELETE" });
}
```

---

## 4. Document Analysis

### 4.1 Run Analysis

This is the main feature — analyze a document with AI.

```typescript
async function analyzeDocument(
  documentId: string,
  analysisType: "tos" | "scam" | "general" = "tos",
  simplificationLevel: "fundamental" | "medio" | "tecnico" = "medio"
) {
  const data = await api(`/api/analyze/${documentId}`, {
    method: "POST",
    body: JSON.stringify({
      analysis_type: analysisType,
      simplification_level: simplificationLevel,
    }),
  });
  return data.analysis;
}
```

**Analysis types:**

| Type | Use case |
|------|----------|
| `tos` | Terms of service, privacy policies, contracts |
| `scam` | Suspicious messages (WhatsApp, SMS, email) |
| `general` | INSS letters, judicial notices, other documents |

**Simplification levels:**

| Level | Target audience |
|-------|-----------------|
| `fundamental` | Basic education — very simple language |
| `medio` | High school — moderate simplification |
| `tecnico` | Technical — preserves legal terminology |

**Rate limits:** Free = 10 analyses/month, Premium = 100/month. Handle `429` errors:

```typescript
try {
  const analysis = await analyzeDocument(docId, "tos");
} catch (err) {
  if (err.message.includes("Limite")) {
    // Show upgrade prompt
  }
}
```

### 4.2 Get Analysis Result

```typescript
async function getAnalysis(analysisId: string) {
  const data = await api(`/api/analyze/${analysisId}`);
  return data.analysis;
}
```

**Response shape:**

```typescript
interface Analysis {
  id: string;
  document_id: string;
  analysis_type: "tos" | "scam" | "general";
  simplification_level: string;
  summary: {
    resumo?: string;              // Short summary
    resumo_executivo?: string;    // Executive summary
    explicacao?: string;          // Detailed explanation
    recomendacao?: string;        // Recommendation
    acao_recomendada?: string;    // Recommended action
    pontos_criticos?: Array<{    // Critical points
      item: string;
      explicacao: string;
    }>;
  };
  abuse_score?: number;           // 0-10 (only for tos type)
  audio_url?: string;             // Set after audio generation
  created_at: string;
}
```

### 4.3 Generate Audio

Convert the analysis summary to audio narration (via ElevenLabs):

```typescript
async function generateAudio(analysisId: string) {
  const data = await api(`/api/analyze/${analysisId}/audio`, {
    method: "POST",
  });
  return data.audio; // { audioUrl: string, cached: boolean }
}
```

**Playing audio:**

```typescript
const { audioUrl } = await generateAudio(analysisId);
const audio = new Audio(audioUrl);
audio.play();
```

### 4.4 Ask Questions (Q&A)

Users can ask follow-up questions about the analysis:

```typescript
async function askQuestion(analysisId: string, question: string) {
  const data = await api(`/api/analyze/${analysisId}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  return data.question; // { id, question, answer, source_excerpt, created_at }
}
```

### 4.5 List Previous Q&A

```typescript
async function listQuestions(analysisId: string) {
  const data = await api(`/api/analyze/${analysisId}/questions`);
  return data.questions;
}
```

---

## 5. Generate Legal Documents

After analyzing a document, users can generate legal complaints:

```typescript
async function generateLegalDoc(
  documentId: string,
  type: "procon" | "juizado" | "sac",
  details: {
    empresa: string;       // Required
    problema: string;      // Required (min 10 chars)
    nome?: string;
    cpf?: string;
    data_ocorrencia?: string;
    valor?: string;
    tentativas_anteriores?: string;
    pedido?: string;
  }
) {
  const data = await api(`/api/documents/${documentId}/generate`, {
    method: "POST",
    body: JSON.stringify({ type, ...details }),
  });
  return data.generated; // { documento, tipo, instrucoes }
}
```

**Document types:**

| Type | Description |
|------|-------------|
| `procon` | Procon consumer complaint |
| `juizado` | Small claims court petition (Juizado Especial) |
| `sac` | SAC (customer service) formal letter |

---

## 6. Company Rankings (Public)

No authentication required:

```typescript
async function getRankings() {
  const res = await fetch(`${API_BASE}/api/ranking`);
  const data = await res.json();
  return data.rankings; // Array of { company_name, avg_abuse_score, total_analyses }
}

async function getCompanyRanking(company: string) {
  const res = await fetch(`${API_BASE}/api/ranking/${encodeURIComponent(company)}`);
  const data = await res.json();
  return data.company;
}
```

---

## 7. Sharing Analysis

### 7.1 Generate Share Link

```typescript
async function getShareLink(analysisId: string) {
  const data = await api(`/api/share/${analysisId}/hash`);
  return data; // { hash, shareUrl }
}
```

### 7.2 View Shared Card (Public)

No auth needed — anyone with the link can view:

```typescript
async function getSharedCard(analysisId: string, hash: string) {
  const res = await fetch(`${API_BASE}/api/share/${analysisId}/card?hash=${hash}`);
  const data = await res.json();
  return data.card;
}
```

### 7.3 Open Graph for Social Previews

When a share link is posted on social media, the OG endpoint provides preview metadata:

```
https://inclusive-api.bbu.app.br/api/share/{analysisId}/og?hash={hash}
```

Your frontend should render a `/share/:analysisId` page that:
1. Extracts the `hash` from query params
2. Calls the card endpoint to get data
3. Includes OG meta tags pointing to the `/og` endpoint

---

## 8. Demo Data (Public)

Pre-loaded demo analyses for showcasing without login:

```typescript
async function listDemos() {
  const res = await fetch(`${API_BASE}/api/demo`);
  const data = await res.json();
  return data.demos; // Array of { key, title }
}

async function getDemo(category: string, slug: string) {
  const res = await fetch(`${API_BASE}/api/demo/${category}/${slug}`);
  const data = await res.json();
  return data.demo; // { title, doc_type, sample_text, analysis }
}
```

**Available categories:** `tos`, `scam`, `general`

**Example:** `GET /api/demo/tos/instagram-meta-platforms`

---

## 9. Complete User Flow

Here's the typical user journey mapped to API calls:

```
┌─────────────────────────────────────────────────────────┐
│  1. LANDING PAGE                                        │
│     • Show demo data (GET /api/demo)                    │
│     • Show rankings (GET /api/ranking)                  │
│     • "Experimente grátis" → signup                     │
├─────────────────────────────────────────────────────────┤
│  2. AUTH                                                │
│     • POST /api/auth/signup                             │
│     • Confirm email                                     │
│     • POST /api/auth/login                              │
│     • Store session tokens                              │
├─────────────────────────────────────────────────────────┤
│  3. ONBOARDING (optional)                               │
│     • PATCH /api/auth/profile                           │
│     • Set age_range, education_level, preferred_output  │
│     • Set accessibility: font_size, high_contrast       │
├─────────────────────────────────────────────────────────┤
│  4. SUBMIT DOCUMENT                                     │
│     • Paste text → POST /api/documents/text             │
│     • Upload file → POST /api/documents/upload          │
│     • User picks analysis_type and simplification_level │
├─────────────────────────────────────────────────────────┤
│  5. ANALYSIS                                            │
│     • POST /api/analyze/{documentId}                    │
│     • Show loading state (takes 5-15 seconds)           │
│     • Display summary, abuse_score, pontos_criticos     │
├─────────────────────────────────────────────────────────┤
│  6. POST-ANALYSIS ACTIONS                               │
│     • 🔊 Audio: POST /api/analyze/{id}/audio            │
│     • ❓ Q&A: POST /api/analyze/{id}/ask                │
│     • 📄 Legal doc: POST /api/documents/{id}/generate   │
│     • 🔗 Share: GET /api/share/{id}/hash                │
├─────────────────────────────────────────────────────────┤
│  7. HISTORY                                             │
│     • GET /api/documents (list all)                     │
│     • GET /api/analyze/{id} (revisit analysis)          │
│     • GET /api/analyze/{id}/questions (past Q&A)        │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Error Handling

All errors follow a consistent format:

```typescript
interface ApiError {
  error: string;        // Human-readable message (Portuguese)
  detail?: string;      // Technical detail
  suggestion?: string;  // What the user can do
}
```

**Handle common errors:**

```typescript
async function apiWithErrorHandling(path: string, options?: RequestInit) {
  try {
    return await api(path, options);
  } catch (err) {
    const message = err.message;

    if (message.includes("Autenticação")) {
      // 401 — session expired, redirect to login
      await supabase.auth.signOut();
      window.location.href = "/login";
      return;
    }

    if (message.includes("Limite")) {
      // 429 — rate limit, show upgrade prompt
      showUpgradeModal();
      return;
    }

    // Show generic error toast
    showToast(message);
    throw err;
  }
}
```

---

## 11. Accessibility Notes

InclusivAI targets users with low digital literacy. The frontend should:

- **Use the profile settings** — respect `font_size`, `high_contrast`, `preferred_output`
- **Auto-generate audio** if `preferred_output` is `"audio"` or `"both"`
- **Use `simplification_level`** matching the user's `education_level`:
  - `fundamental` → `"fundamental"`
  - `medio` → `"medio"`
  - `superior` / `pos_graduacao` → `"tecnico"`
- **Display `pontos_criticos`** prominently — these are the key takeaways
- **Show `abuse_score`** as a visual gauge (0 = safe, 10 = very abusive)
- **Offer the legal doc generator** when `abuse_score >= 7`
