# InclusivAI Backend — Deploy Guide

Step-by-step guide to deploy the backend to Cloudflare Workers.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Cloudflare account (free tier works)
- Supabase project (free tier works)
- Mistral AI API key
- ElevenLabs API key

---

## 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window. Authorize wrangler to access your Cloudflare account.

---

## 2. Create KV Namespace

```bash
cd backend
npx wrangler kv namespace create INCLUSIVAI-CACHE
```

This outputs something like:

```
{ binding = "INCLUSIVAI_CACHE", id = "abc123def456..." }
```

**Copy the `id` value** and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "INCLUSIVAI_CACHE"
id = "abc123def456..."
```

Uncomment the KV block and replace `YOUR_KV_NAMESPACE_ID` with the actual ID.

---

## 3. Set Secrets

Each secret must be set individually. Run these commands and paste the values when prompted:

```bash
# Mistral AI
npx wrangler secret put MISTRAL_API_KEY
# Paste your Mistral API key

# ElevenLabs
npx wrangler secret put ELEVENLABS_API_KEY
# Paste your ElevenLabs API key

# Supabase
npx wrangler secret put SUPABASE_URL
# Paste: https://your-project.supabase.co

npx wrangler secret put SUPABASE_ANON_KEY
# Paste your Supabase anon key

npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste your Supabase service role key

# Share hash secret (generate a random string)
npx wrangler secret put SHARE_HASH_SECRET
# Paste a random string (e.g., openssl rand -hex 32)
```

To verify secrets are set:

```bash
npx wrangler secret list
```

---

## 4. Set Up Supabase

### 4.1 Run Migrations

Go to your Supabase dashboard → SQL Editor → New Query. Run each migration file **in order**:

1. `migrations/001_enums.sql`
2. `migrations/002_profiles.sql`
3. `migrations/003_documents.sql`
4. `migrations/004_analyses.sql`
5. `migrations/005_questions.sql`
6. `migrations/006_rankings.sql`
7. `migrations/007_rls_policies.sql`
8. `migrations/008_increment_analyses.sql`

### 4.2 Create Storage Buckets

In Supabase dashboard → Storage:

1. Create bucket `uploads` (private)
2. Create bucket `audio` (public)

For the `audio` bucket, add a public policy:
- Go to Policies → New Policy → Allow public access for SELECT

---

## 5. Seed Demo Data

Generate and upload demo data to KV (run from the `backend/` directory):

```bash
cd backend

# Generate the bulk JSON file
npm run seed

# Upload to KV
npx wrangler kv bulk put scripts/kv/_bulk.json --binding INCLUSIVAI_CACHE
```

---

## 6. Deploy

```bash
npx wrangler deploy
```

This outputs your Worker URL, e.g.: `https://inclusive-api.bbu.app.br/health`

---

## 7. Smoke Test Production

### 7.1 Health Check

```bash
curl https://inclusive-api.bbu.app.br/health
# Expected: {"status":"ok"}
```

### 7.2 Auth Flow

```bash
# Signup
curl -X POST https://inclusive-api.bbu.app.br/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

# Login (save the access_token)
curl -X POST https://inclusive-api.bbu.app.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

# Get profile (use the token from login)
curl https://inclusive-api.bbu.app.br/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7.3 Analyze Text Document

```bash
# Create document
curl -X POST https://inclusive-api.bbu.app.br/api/documents/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Teste",
    "raw_text": "Termos de uso: Ao usar nosso serviço, você concede licença irrevogável e perpétua de todo conteúdo publicado. Não nos responsabilizamos por danos.",
    "doc_type": "termos_de_uso"
  }'

# Analyze (use the document ID from above)
curl -X POST https://inclusive-api.bbu.app.br/api/analyze/DOCUMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"analysis_type":"tos","simplification_level":"medio"}'
```

### 7.4 Image Upload (Scam Detection)

```bash
curl -X POST https://inclusive-api.bbu.app.br/api/documents/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@screenshot.png" \
  -F "title=WhatsApp Screenshot"

# Analyze as scam
curl -X POST https://inclusive-api.bbu.app.br/api/analyze/DOCUMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"analysis_type":"scam","simplification_level":"fundamental"}'
```

### 7.5 Generate Audio

```bash
curl -X POST https://inclusive-api.bbu.app.br/api/analyze/ANALYSIS_ID/audio \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7.6 Demo Data

```bash
# List demos
curl https://inclusive-api.bbu.app.br/api/demo

# Get specific demo
curl https://inclusive-api.bbu.app.br/api/demo/tos/instagram-meta-platforms
```

### 7.7 Ranking (Public)

```bash
curl https://inclusive-api.bbu.app.br/api/ranking
```

---

## 8. Update CORS for Frontend

After deploying the frontend, update `src/index.ts` CORS origin array to include the production frontend URL:

```typescript
cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-domain.com",
  ],
})
```

Then redeploy: `npx wrangler deploy`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `KV namespace not found` | Make sure you uncommented the KV block in `wrangler.toml` and used the correct ID |
| `Secret not found` | Run `npx wrangler secret list` to verify all secrets are set |
| `Supabase connection error` | Verify SUPABASE_URL starts with `https://` and includes `.supabase.co` |
| `Mistral API timeout` | Check your API key is valid at `console.mistral.ai` |
| `CORS error from frontend` | Add the frontend URL to the `origin` array in `src/index.ts` |
| `RLS policy error` | Make sure all migrations ran in order, especially `007_rls_policies.sql` |
