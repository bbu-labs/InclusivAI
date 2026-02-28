# Clausula Oculta - Backend Implementation Plan

## Context

AI-powered consumer protection for Brazil. Hackathon project (Mistral 2026). Backend built with **Cloudflare Workers + Hono.js (TypeScript)**, using **Mistral models** (Ministral 8B, Mistral Large 3, Pixtral, Voxtral), **ElevenLabs** for audio, **Supabase** for DB/Auth. Each phase ends with a git commit.

---

## PHASE 1: Project Scaffolding
**Commit message**: `feat: initialize backend project with Hono + Cloudflare Workers`

### Tasks:
- [x] 1.1 Create `backend/` directory
- [x] 1.2 Initialize `package.json` with dependencies (hono, @mistralai/mistralai, @supabase/supabase-js, zod, @hono/zod-validator)
- [x] 1.3 Initialize `tsconfig.json` for Cloudflare Workers
- [x] 1.4 Create `wrangler.toml` with project name, compatibility_date, nodejs_compat flag, KV namespace placeholder
- [x] 1.5 Create `.dev.vars` template and `.env.example` with all required secrets (MISTRAL_API_KEY, ELEVENLABS_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SHARE_HASH_SECRET)
- [x] 1.6 Create `src/types.ts` — Bindings (KV, env vars), Variables (user, supabase clients), shared enums and types
- [x] 1.7 Create `src/index.ts` — Hono app with CORS middleware, error handler, health check at `/health`
- [ ] 1.8 Verify: `npx wrangler dev` starts, `/health` returns `{ status: "ok" }`

---

## PHASE 2: Supabase Schema + Auth
**Commit message**: `feat: add Supabase schema migrations and auth routes`

### Tasks:
- [ ] 2.1 Create `migrations/001_enums.sql` — age_range, education_level, user_plan, doc_type, source_type, simplification_level
- [ ] 2.2 Create `migrations/002_profiles.sql` — profiles table + trigger to auto-create profile on user signup
- [ ] 2.3 Create `migrations/003_documents.sql` — documents table with indexes
- [ ] 2.4 Create `migrations/004_analyses.sql` — analyses table with indexes
- [ ] 2.5 Create `migrations/005_questions.sql` — questions table with indexes
- [ ] 2.6 Create `migrations/006_rankings.sql` — company_rankings table
- [ ] 2.7 Create `migrations/007_rls_policies.sql` — RLS on all tables (users own data, rankings public, analyses via service_role)
- [ ] 2.8 Create `src/services/supabase.ts` — factory functions: `createSupabaseClient(url, anonKey)` and `createSupabaseAdmin(url, serviceRoleKey)`
- [ ] 2.9 Create `src/middleware/auth.ts` — extract Bearer token, verify with supabase.auth.getUser(), set user on context. Support anonymous (null user)
- [ ] 2.10 Create `src/routes/auth.ts`:
  - POST `/api/auth/signup` (email+password)
  - POST `/api/auth/login` (sign in with password)
  - POST `/api/auth/logout`
  - GET `/api/auth/me` (get profile)
  - PATCH `/api/auth/profile` (update age_range, education_level, preferred_output, font_size, high_contrast)
- [ ] 2.11 Register auth routes in `src/index.ts`
- [ ] 2.12 Verify: signup → login → get profile → update profile works end-to-end

---

## PHASE 3: Documents CRUD
**Commit message**: `feat: add documents routes (text input, list, get, delete)`

### Tasks:
- [ ] 3.1 Create Zod schemas for document requests/responses in route file
- [ ] 3.2 Create `src/routes/documents.ts`:
  - POST `/api/documents/text` — submit pasted text, save to documents table
  - GET `/api/documents` — list user's documents (id, title, doc_type, source_type, created_at)
  - GET `/api/documents/:id` — get single document with full data
  - DELETE `/api/documents/:id` — soft delete (owner only)
- [ ] 3.3 Register documents routes in `src/index.ts`
- [ ] 3.4 Verify: create document → list → get by id → delete

---

## PHASE 4: Mistral Client + LLM Utilities
**Commit message**: `feat: add Mistral client wrapper with retry logic and JSON parsing`

### Tasks:
- [ ] 4.1 Create `src/services/mistral.ts`:
  - Initialize Mistral client with API key
  - `chatJSON(model, messages, maxTokens)` — sends request with `response_format: { type: "json_object" }`, parses response
  - Retry logic: 3 attempts, exponential backoff (2s, 4s, 8s) on 429/500/timeout
  - Model constants: `MINISTRAL_8B = "ministral-8b-latest"`, `MISTRAL_LARGE = "mistral-large-latest"`, `PIXTRAL = "pixtral-large-latest"`
- [ ] 4.2 Create `src/lib/json-parser.ts`:
  - Strip markdown code fences (` ```json...``` `)
  - Find first `{` to last `}` fallback
  - Throw descriptive error if no valid JSON found
- [ ] 4.3 Create `src/lib/token-utils.ts`:
  - `estimateTokens(text)` — ~4 chars per token for Portuguese
  - `truncateToTokens(text, maxTokens)` — truncate preserving word boundaries
- [ ] 4.4 Verify: call Mistral API with a simple prompt → get parsed JSON response

---

## PHASE 5: Agent Reader (Text Extraction)
**Commit message**: `feat: add Agent Reader for text extraction and structuring`

### Tasks:
- [ ] 5.1 Create `src/agents/base.ts`:
  - `AgentResult` type: { success, data, error, tokensInput, tokensOutput, modelUsed, durationMs }
  - `runAgent(fn)` helper: wraps execution with timing and error handling
- [ ] 5.2 Create `src/prompts/reader.ts`:
  - System prompt for text structuring: extract titulo, tipo_documento, orgao_emissor, data_documento, texto_completo, secoes[]
  - Must return valid JSON only
- [ ] 5.3 Create `src/agents/reader.ts`:
  - `readFromText(rawText, mistralClient)` — sends text to Ministral 8B, returns structured JSON
  - Token limits: input 32k, output 4k
  - Handles text truncation if input exceeds limit
- [ ] 5.4 Verify: pass a sample ToS text → get structured JSON output

---

## PHASE 6: Agent Simplifier (Analysis + Scoring)
**Commit message**: `feat: add Agent Simplifier with ToS and scam analysis prompts`

### Tasks:
- [ ] 6.1 Create `src/prompts/tos-analysis.ts`:
  - Score 0-10 (abusividade), resumo, clausulas_abusivas[] (texto_original, explicacao_simples, artigo_cdc, gravidade), pontos_positivos[], recomendacao
  - Legal basis: CDC (Lei 8.078/90), LGPD (Lei 13.709/18), Marco Civil (Lei 12.965/14)
  - `{{NIVEL}}` template for simplification level
  - `LEVEL_DESCRIPTIONS` map: fundamental / medio / tecnico
- [ ] 6.2 Create `src/prompts/scam-detection.ts`:
  - classificacao (golpe_provavel/suspeito/aparentemente_legitimo), confianca (0-100), sinais_alerta[], explicacao, acao_recomendada, onde_denunciar[]
- [ ] 6.3 Create `src/prompts/simplifier.ts`:
  - General document simplification prompt for non-ToS, non-scam documents (INSS, judicial, etc.)
  - Outputs: resumo_executivo, pontos_criticos[], acoes_recomendadas[], prazos[], base_legal[]
- [ ] 6.4 Create `src/agents/simplifier.ts`:
  - `simplifyDocument(structuredData, analysisType, simplificationLevel, mistralClient)`
  - Uses Mistral Large 3
  - Selects prompt based on analysisType: "tos" | "scam" | "general"
  - Injects simplification level into prompt template
  - Token limits: input 8k, output 2k
- [ ] 6.5 Verify: pass structured ToS data → get score, abusive clauses, recommendations

---

## PHASE 7: Pipeline Orchestrator + Analysis Routes
**Commit message**: `feat: add analysis pipeline and /api/analyze endpoints`

### Tasks:
- [ ] 7.1 Create `src/agents/pipeline.ts`:
  - `analyzeDocument({ sourceType, content, userId, documentId, simplificationLevel, analysisType, generateAudio })`
  - Step 1: Reader Agent → structured_data
  - Step 2: Update document record with structured_data, raw_text, title, doc_type
  - Step 3: Simplifier Agent → summary + abuse_score
  - Step 4: Save analysis record to analyses table (via service_role)
  - Step 5: Increment user's analyses_this_month
  - Step 6: Return { analysisId, summary, abuseScore, tokensUsed, costUsd }
  - Cost estimation helper: input_tokens * rate + output_tokens * rate
- [ ] 7.2 Create `src/routes/analyze.ts`:
  - POST `/api/analyze/:documentId` — run pipeline, check rate limit (10/month free), return analysis
  - GET `/api/analyze/:analysisId` — get analysis result
- [ ] 7.3 Register analyze routes in `src/index.ts`
- [ ] 7.4 **End-to-End Test**: POST text document → POST analyze → GET result → verify score, clauses, recommendations
- [ ] 7.5 Test with real Instagram ToS text, verify response < 15s

---

## PHASE 8: File Upload (PDF + Image) + OCR
**Commit message**: `feat: add PDF/image upload with Pixtral OCR`

### Tasks:
- [ ] 8.1 Create `src/services/pdf.ts`:
  - `extractTextFromPdf(pdfBytes: ArrayBuffer)` — use pdf-parse or pdfjs-dist for text extraction
  - Fallback: if text is empty (scanned PDF), flag for OCR
- [ ] 8.2 Update `src/agents/reader.ts`:
  - Add `readFromPdf(pdfBytes, mistralClient)` — extract text, then structure
  - Add `readFromImage(imageBytes, mimeType, mistralClient)` — send base64 to Pixtral via vision message format
- [ ] 8.3 Update `src/routes/documents.ts`:
  - POST `/api/documents/upload` — accept multipart form data (PDF or image)
  - Validate file size (5MB free tier)
  - Detect content type (application/pdf vs image/*)
  - Store file in Supabase Storage: `uploads/{userId}/{filename}`
  - Save document record with source_type and file_path
- [ ] 8.4 Update `src/agents/pipeline.ts`:
  - Handle pdf_upload: download file from Supabase Storage → extract text → Reader
  - Handle image_upload: download file → base64 encode → Pixtral OCR → Reader
- [ ] 8.5 Verify PDF upload: upload PDF → analyze → verify text extraction
- [ ] 8.6 Verify Image OCR: upload WhatsApp screenshot → analyze as scam → verify classification

---

## PHASE 9: Audio Generation (ElevenLabs TTS)
**Commit message**: `feat: add audio generation with ElevenLabs TTS and KV caching`

### Tasks:
- [ ] 9.1 Create `src/services/elevenlabs.ts`:
  - `generateSpeech(text, apiKey)` — POST to ElevenLabs API, model: eleven_multilingual_v2, Portuguese voice
  - Returns: audio MP3 bytes
  - Timeout: 60s
  - Max 5000 characters per request
- [ ] 9.2 Create `src/agents/audio.ts`:
  - `generateAudio(summaryText, analysisId, supabaseAdmin, kvCache, elevenLabsKey)`
  - Hash text (SHA-256 first 16 chars) → check KV cache
  - If cache miss: call ElevenLabs → upload MP3 to Supabase Storage (`audio/{analysisId}/{hash}.mp3`)
  - Save audio_url + duration estimate to KV cache
  - Return { audioUrl, durationSec }
- [ ] 9.3 Update `src/routes/analyze.ts`:
  - POST `/api/analyze/:analysisId/audio` — generate audio for existing analysis
  - Check if audio already exists (return cached URL)
  - Build audio text from summary (resumo_executivo + pontos_criticos)
- [ ] 9.4 Create Supabase Storage buckets: `audio`, `uploads` (via Supabase dashboard)
- [ ] 9.5 Verify: analyze document → generate audio → verify MP3 URL plays correctly
- [ ] 9.6 Verify KV cache: second audio request for same analysis returns instantly

---

## PHASE 10: Rate Limiting + Error Handling
**Commit message**: `feat: add rate limiting via KV and production error handling`

### Tasks:
- [ ] 10.1 Create `src/middleware/rate-limit.ts`:
  - KV-based rate limiter: key `rl:{userId}:{resource}:{period}`
  - `checkRateLimit(kv, userId, resource, maxRequests, windowMs)`
  - Resources: analyses (10/month), audio (5/month), questions (5/doc), doc_gen (3/month)
  - Return 429 with user-friendly message in Portuguese when exceeded
- [ ] 10.2 Update `src/index.ts` error handler:
  - HTTPException → structured JSON { error, detail, suggestion }
  - Mistral API errors → 502 "O servico de IA demorou para responder"
  - Supabase errors → 500 with safe message
  - Validation errors (Zod) → 400 with field-level errors
- [ ] 10.3 Add `ctx.waitUntil()` for non-critical async work (cache writes, analytics)
- [ ] 10.4 Verify: exceed rate limit → get 429. Trigger Mistral timeout → get 502 with Portuguese message

---

## PHASE 11: Q&A Agent (RAG)
**Commit message**: `feat: add Q&A agent for document questions`

### Tasks:
- [ ] 11.1 Create `src/agents/questions.ts`:
  - `askQuestion(question, documentText, analysisSummary, mistralClient)`
  - Uses Ministral 8B (cheaper, sufficient for Q&A)
  - Context: document text truncated to 4k tokens + analysis summary
  - System prompt: answer only based on document, cite source excerpt, refuse off-topic
  - Returns: { answer, sourceExcerpt }
- [ ] 11.2 Update `src/routes/analyze.ts`:
  - POST `/api/analyze/:analysisId/ask` — check question limit, run Q&A agent, save to questions table
  - GET `/api/analyze/:analysisId/questions` — list previous Q&A for this analysis
- [ ] 11.3 Verify: analyze document → ask 3 questions → verify answers reference document content

---

## PHASE 12: Document Generation
**Commit message**: `feat: add legal document generation (Procon, Juizado, SAC)`

### Tasks:
- [ ] 12.1 Create `src/prompts/document-gen.ts`:
  - Prompt for generating: carta_reclamacao_procon, peticao_juizado_especial, script_sac
  - Input: consumer name, company, problem description, date, amount, previous attempts
  - Output: formatted legal document with CDC articles, [PREENCHER] markers for missing data
- [ ] 12.2 Add document generation endpoint or extend analysis route:
  - POST `/api/documents/:documentId/generate` — type, consumer data → generated document text
  - Uses Mistral Large 3 for legal quality
- [ ] 12.3 Verify: provide case data → generate Procon complaint letter → verify legal formatting

---

## PHASE 13: Company Ranking
**Commit message**: `feat: add company ranking endpoints`

### Tasks:
- [ ] 13.1 Create `src/routes/ranking.ts`:
  - GET `/api/ranking` — public, list companies ordered by avg_abuse_score DESC, include total_analyses
  - GET `/api/ranking/:company` — company detail with top_issues breakdown
- [ ] 13.2 Update pipeline: after ToS analysis, upsert company_rankings (extract company name, update avg score)
- [ ] 13.3 Register ranking routes in `src/index.ts`
- [ ] 13.4 Verify: analyze multiple ToS → check ranking reflects results

---

## PHASE 14: Share Card Data
**Commit message**: `feat: add share card and Open Graph metadata endpoints`

### Tasks:
- [ ] 14.1 Add to `src/routes/ranking.ts` or new share route:
  - GET `/api/share/:analysisId/card` — return analysis summary JSON for frontend card rendering (public via hash)
  - GET `/api/share/:analysisId/og` — Open Graph metadata (title, description, image URL) for social preview
- [ ] 14.2 Generate share hash: HMAC-SHA256(analysisId, SHARE_HASH_SECRET) for public access without auth
- [ ] 14.3 Verify: share link works without authentication, OG metadata renders in social preview

---

## PHASE 15: Demo Data + Deploy
**Commit message**: `feat: deploy to Cloudflare Workers with demo data`

### Tasks:
- [ ] 15.1 Pre-analyze 5+ real ToS: Instagram, Uber, iFood, Nubank, Shein — cache results in KV
- [ ] 15.2 Prepare scam examples: WhatsApp screenshot, fake Pix message, phishing email
- [ ] 15.3 Prepare INSS letter and judicial intimation examples
- [ ] 15.4 Set all secrets via `wrangler secret put`
- [ ] 15.5 Create KV namespace via `wrangler kv namespace create CACHE`
- [ ] 15.6 Update `wrangler.toml` with production KV namespace ID
- [ ] 15.7 Run `wrangler deploy`
- [ ] 15.8 Smoke test production: /health → auth → analyze text → analyze image → generate audio
- [ ] 15.9 Verify CORS works with frontend URL
- [ ] 15.10 Test from mobile on 4G

---

## PHASE 16: Final Polish + Fallback
**Commit message**: `feat: add fallback strategy and API documentation`

### Tasks:
- [ ] 16.1 Add fallback: if Mistral API is down, return pre-cached demo results from KV
- [ ] 16.2 Add request logging (console.log with timestamp, path, status, duration)
- [ ] 16.3 Create `.env.example` with all required vars documented
- [ ] 16.4 Update CORS for production frontend URL
- [ ] 16.5 Final deploy: `wrangler deploy`
- [ ] 16.6 Record video backup of full demo flow (text → image → audio → document generation)
