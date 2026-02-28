# InclusivAI API Reference

**Base URL:** `https://inclusive-api.bbu.app.br`

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Obtain a token via `/api/auth/login` or `/api/auth/signup`.

---

## Endpoints

### Health

#### `GET /health`

```bash
curl https://inclusive-api.bbu.app.br/health
```

**Response** `200`
```json
{ "status": "ok" }
```

---

### Auth

#### `POST /api/auth/signup`

Create a new account.

```bash
curl -X POST /api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secret123",
    "full_name": "Maria Silva"
  }'
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | yes | Valid email |
| `password` | string | yes | Min 6 chars |
| `full_name` | string | no | — |

**Response** `201`
```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "session": { "access_token": "...", "refresh_token": "...", "expires_at": 1234567890 }
}
```

**Errors:** `400` validation or signup error

---

#### `POST /api/auth/login`

```bash
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "secret123" }'
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | yes |
| `password` | string | yes |

**Response** `200`
```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

**Errors:** `401` invalid credentials

---

#### `POST /api/auth/logout` 🔒

```bash
curl -X POST /api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

**Response** `200`
```json
{ "message": "Logout realizado com sucesso" }
```

---

#### `GET /api/auth/me` 🔒

Get current user profile.

**Response** `200`
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Maria Silva",
    "age_range": "25-34",
    "education_level": "medio",
    "preferred_output": "text",
    "font_size": 16,
    "high_contrast": false,
    "plan": "free",
    "analyses_this_month": 3,
    "month_reset_at": "2026-04-01T00:00:00Z",
    "created_at": "2026-02-28T18:00:00Z",
    "updated_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:** `404` profile not found

---

#### `PATCH /api/auth/profile` 🔒

Update profile fields. All fields are optional — send only the ones you want to change.

```bash
curl -X PATCH /api/auth/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "age_range": "25-34", "high_contrast": true }'
```

| Field | Type | Values |
|-------|------|--------|
| `full_name` | string | — |
| `age_range` | enum | `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65+` |
| `education_level` | enum | `fundamental`, `medio`, `superior`, `pos_graduacao` |
| `preferred_output` | enum | `text`, `audio`, `both` |
| `font_size` | number | 12–32 |
| `high_contrast` | boolean | — |

**Response** `200`
```json
{ "profile": { ... } }
```

---

### Documents

All document endpoints require authentication 🔒.

#### `POST /api/documents/text` 🔒

Create a document from pasted text.

```bash
curl -X POST /api/documents/text \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Termos Instagram",
    "raw_text": "Ao usar nosso serviço, você concede...",
    "doc_type": "termos_de_uso"
  }'
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | yes | 1–200 chars |
| `raw_text` | string | yes | 10–100,000 chars |
| `doc_type` | enum | no | Default: `outro`. Values: `termos_de_uso`, `contrato`, `notificacao_judicial`, `carta_inss`, `mensagem_suspeita`, `outro` |

**Response** `201`
```json
{
  "document": {
    "id": "uuid",
    "title": "Termos Instagram",
    "doc_type": "termos_de_uso",
    "source_type": "text_input",
    "created_at": "2026-02-28T18:00:00Z"
  }
}
```

---

#### `POST /api/documents/upload` 🔒

Upload a PDF or image file (max 5 MB).

```bash
curl -X POST /api/documents/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@contract.pdf" \
  -F "title=Contrato Aluguel"
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | file | yes | PDF, JPEG, PNG. Max 5 MB |
| `title` | string | no | Defaults to filename |

**Response** `201`
```json
{
  "document": {
    "id": "uuid",
    "title": "Contrato Aluguel",
    "doc_type": null,
    "source_type": "pdf_upload",
    "file_path": "uploads/uuid/contract.pdf",
    "created_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:** `400` no file, unsupported type, or exceeds 5 MB

---

#### `GET /api/documents` 🔒

List all user documents (excluding soft-deleted).

**Response** `200`
```json
{
  "documents": [
    {
      "id": "uuid",
      "title": "Termos Instagram",
      "doc_type": "termos_de_uso",
      "source_type": "text_input",
      "created_at": "2026-02-28T18:00:00Z"
    }
  ]
}
```

---

#### `GET /api/documents/:id` 🔒

Get a single document with full details.

**Response** `200`
```json
{
  "document": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Termos Instagram",
    "raw_text": "Ao usar nosso serviço...",
    "doc_type": "termos_de_uso",
    "source_type": "text_input",
    "file_path": null,
    "file_size_bytes": null,
    "is_deleted": false,
    "created_at": "2026-02-28T18:00:00Z",
    "updated_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:** `404` document not found

---

#### `DELETE /api/documents/:id` 🔒

Soft-delete a document.

**Response** `200`
```json
{ "message": "Documento excluído com sucesso" }
```

---

#### `POST /api/documents/:documentId/generate` 🔒

Generate a legal document (Procon complaint, Juizado petition, or SAC letter) based on a previously analyzed document.

```bash
curl -X POST /api/documents/DOC_ID/generate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "procon",
    "empresa": "Meta Platforms",
    "problema": "Dados pessoais compartilhados sem consentimento explícito"
  }'
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | enum | yes | `procon`, `juizado`, `sac` |
| `empresa` | string | yes | Company name (min 1 char) |
| `problema` | string | yes | Problem description (min 10 chars) |
| `nome` | string | no | Complainant name |
| `cpf` | string | no | Complainant CPF |
| `data_ocorrencia` | string | no | Date of occurrence |
| `valor` | string | no | Monetary value involved |
| `tentativas_anteriores` | string | no | Previous resolution attempts |
| `pedido` | string | no | Specific request |

**Response** `201`
```json
{
  "generated": {
    "documento": "RECLAMAÇÃO AO PROCON...",
    "tipo": "procon",
    "instrucoes": "Imprima este documento e leve ao Procon..."
  }
}
```

---

### Analyze

All analyze endpoints require authentication 🔒.

#### `POST /api/analyze/:documentId` 🔒

Run the AI analysis pipeline on a document.

```bash
curl -X POST /api/analyze/DOC_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "analysis_type": "tos", "simplification_level": "medio" }'
```

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `analysis_type` | enum | no | `tos`. Values: `tos`, `scam`, `general` |
| `simplification_level` | enum | no | `medio`. Values: `fundamental`, `medio`, `tecnico` |

**Rate limits:** Free plan = 10/month, Premium = 100/month.

**Response** `201`
```json
{
  "analysis": {
    "id": "uuid",
    "document_id": "uuid",
    "user_id": "uuid",
    "analysis_type": "tos",
    "simplification_level": "medio",
    "summary": {
      "resumo": "...",
      "resumo_executivo": "...",
      "explicacao": "...",
      "recomendacao": "...",
      "acao_recomendada": "...",
      "pontos_criticos": [
        { "item": "Licença irrevogável", "explicacao": "..." }
      ]
    },
    "abuse_score": 7.5,
    "audio_url": null,
    "created_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:**
- `404` document not found
- `400` no text to analyze
- `429` rate limit exceeded

---

#### `GET /api/analyze/:analysisId` 🔒

Get a completed analysis.

**Response** `200`
```json
{ "analysis": { ... } }
```

**Errors:** `404` analysis not found

---

#### `POST /api/analyze/:analysisId/audio` 🔒

Generate (or retrieve cached) audio narration of the analysis summary.

```bash
curl -X POST /api/analyze/ANALYSIS_ID/audio \
  -H "Authorization: Bearer TOKEN"
```

**Response** `201` (or `200` if cached)
```json
{
  "audio": {
    "audioUrl": "https://...supabase.co/storage/v1/object/public/audio/...",
    "cached": false
  }
}
```

**Errors:**
- `404` analysis not found
- `400` no content to generate audio from

---

#### `POST /api/analyze/:analysisId/ask` 🔒

Ask a follow-up question about a completed analysis.

```bash
curl -X POST /api/analyze/ANALYSIS_ID/ask \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "question": "O que significa licença irrevogável?" }'
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `question` | string | yes | 3–500 chars |

**Response** `201`
```json
{
  "question": {
    "id": "uuid",
    "question": "O que significa licença irrevogável?",
    "answer": "Uma licença irrevogável significa que...",
    "source_excerpt": "...trecho do documento original...",
    "created_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:**
- `404` analysis not found
- `502` failed to generate answer

---

#### `GET /api/analyze/:analysisId/questions` 🔒

List all previous Q&A for an analysis.

**Response** `200`
```json
{
  "questions": [
    {
      "id": "uuid",
      "question": "...",
      "answer": "...",
      "source_excerpt": "...",
      "created_at": "2026-02-28T18:00:00Z"
    }
  ]
}
```

---

### Ranking

Public endpoints — no authentication required.

#### `GET /api/ranking`

List company rankings by abuse score.

```bash
curl https://inclusive-api.bbu.app.br/api/ranking
```

**Response** `200`
```json
{
  "rankings": [
    {
      "id": "uuid",
      "company_name": "Meta Platforms",
      "avg_abuse_score": 7.2,
      "total_analyses": 42,
      "last_analysis_at": "2026-02-28T18:00:00Z"
    }
  ]
}
```

---

#### `GET /api/ranking/:company`

Get ranking details for a specific company.

**Response** `200`
```json
{
  "company": {
    "id": "uuid",
    "company_name": "Meta Platforms",
    "avg_abuse_score": 7.2,
    "total_analyses": 42,
    "last_analysis_at": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:** `404` company not found

---

### Share

Hash-protected public endpoints for sharing analysis cards.

#### `GET /api/share/:analysisId/hash` 🔒

Generate a share hash for an analysis.

```bash
curl /api/share/ANALYSIS_ID/hash \
  -H "Authorization: Bearer TOKEN"
```

**Response** `200`
```json
{
  "hash": "abc123...",
  "shareUrl": "https://inclusive-api.bbu.app.br/api/share/ANALYSIS_ID/card?hash=abc123..."
}
```

---

#### `GET /api/share/:analysisId/card?hash=HASH`

Get a public share card (no auth needed, hash required).

```bash
curl "https://inclusive-api.bbu.app.br/api/share/ANALYSIS_ID/card?hash=abc123..."
```

**Response** `200`
```json
{
  "card": {
    "analysisId": "uuid",
    "documentTitle": "Termos Instagram",
    "documentType": "termos_de_uso",
    "analysisType": "tos",
    "abuseScore": 7.5,
    "resumo": "Este documento contém cláusulas que...",
    "createdAt": "2026-02-28T18:00:00Z"
  }
}
```

**Errors:**
- `400` missing hash
- `403` invalid hash
- `404` analysis not found

---

#### `GET /api/share/:analysisId/og?hash=HASH`

Open Graph metadata for link previews.

**Response** `200`
```json
{
  "og": {
    "title": "InclusivAI — Termos Instagram",
    "description": "Nota de abusividade: 7.5/10. Este documento contém cláusulas que...",
    "type": "article",
    "url": "https://inclusive-api.bbu.app.br/api/share/ANALYSIS_ID/card?hash=abc123..."
  }
}
```

---

### Demo

Public endpoints — no authentication required. Data served from Cloudflare KV.

#### `GET /api/demo`

List all available demo entries.

```bash
curl https://inclusive-api.bbu.app.br/api/demo
```

**Response** `200`
```json
{
  "demos": [
    { "key": "demo:tos:instagram-meta-platforms", "title": "Instagram (Meta Platforms)" },
    { "key": "demo:scam:golpe-do-pix-via-whatsapp", "title": "Golpe do Pix via WhatsApp" }
  ]
}
```

**Errors:** `503` KV cache not configured

---

#### `GET /api/demo/:category/:slug`

Get a specific demo entry.

```bash
curl https://inclusive-api.bbu.app.br/api/demo/tos/instagram-meta-platforms
```

**Response** `200`
```json
{
  "demo": {
    "title": "Instagram (Meta Platforms)",
    "doc_type": "termos_de_uso",
    "sample_text": "Ao usar nosso serviço...",
    "analysis": {
      "resumo": "...",
      "pontos_criticos": [...],
      "abuse_score": 7.5
    }
  }
}
```

**Errors:**
- `404` demo not found
- `503` KV cache not configured

---

## Enums Reference

| Enum | Values |
|------|--------|
| `age_range` | `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65+` |
| `education_level` | `fundamental`, `medio`, `superior`, `pos_graduacao` |
| `user_plan` | `free`, `premium` |
| `doc_type` | `termos_de_uso`, `contrato`, `notificacao_judicial`, `carta_inss`, `mensagem_suspeita`, `outro` |
| `source_type` | `text_input`, `pdf_upload`, `image_upload`, `url_import` |
| `simplification_level` | `fundamental`, `medio`, `tecnico` |
| `analysis_type` | `tos`, `scam`, `general` |
| `preferred_output` | `text`, `audio`, `both` |

## Error Format

All errors follow this structure:

```json
{
  "error": "Human-readable message in Portuguese",
  "detail": "Technical detail (optional)",
  "suggestion": "What the user can do (optional)"
}
```

Common HTTP status codes:
- `400` — Validation error or bad request
- `401` — Missing or invalid token
- `403` — Forbidden (invalid share hash)
- `404` — Resource not found
- `429` — Rate limit exceeded
- `500` — Internal server error
- `502` — Upstream AI service error
- `503` — Service unavailable (KV not configured)
