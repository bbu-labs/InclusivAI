# Clausula Oculta | InclusivAI

[Access Here](http://inclusivai.bbu.app.br) | [API Docs](https://inclusive-api.bbu.app.br/api/docs)

**Multi-agent AI system for consumer protection** that transforms Terms of Service, contracts, government letters, and suspicious messages into accessible plain language, flagging abusive clauses, detecting scams, and citing the exact laws that protect you. All in under 30 seconds.

> Built for the **Mistral AI Hackathon 2026** by **BBU Labs**

---

## Pitch Video

[![Clausula Oculta Pitch Video](https://img.youtube.com/vi/Cb9tHJWlFrs/maxresdefault.jpg)](https://youtu.be/Cb9tHJWlFrs)

**[Watch on YouTube](https://youtu.be/Cb9tHJWlFrs)** | 2.5-minute overview of the problem, solution, demo, and architecture.

---

## The Problem

- **95% of people** never read the Terms of Service they agree to
- **2.8 million digital scams** reported in Brazil in a single year, causing **R$ 2.5 billion** in losses
- **156 million internet users** in Brazil with virtually **zero consumer legal AI products** in Portuguese
- Searches for digital rights have grown **576%**
- Legal documents are designed to be unreadable. Companies count on that.

---

## About the Project

**Clausula Oculta** (Hidden Clause) analyzes complex documents like Terms of Service, contracts, INSS benefit letters, court notices, and suspicious messages, then translates them into simple, accessible, and understandable language. The system uses a multi-agent AI pipeline powered by **Mistral AI** to extract text, classify document types, identify abusive clauses, detect scams, and generate legal consumer defense documents.

### Key Features

- **Document analysis** with Protection Score (0–100) and scam detection
- **5 input methods**: URL paste, text paste, PDF/image upload, camera/photo (OCR), audio recording (STT)
- **Accessible explanations** with adjustable simplification levels (fundamental, intermediate, technical)
- **Audio narration** of results via ElevenLabs (3 language-matched voices)
- **Q&A** about the analyzed document , grounded in actual text with cited excerpts
- **Legal document generation**: PROCON complaints, Small Claims Court petitions, SAC call scripts
- **Company ranking** , public leaderboard by aggregated abuse scores
- **Social sharing** with HMAC-signed links and auto-generated Open Graph image cards
- **Age-adaptive UI** that transforms based on user age profile (senior mode with larger fonts, audio-first, guided tips)
- **3 countries**: Brazil (PT-BR), United States (EN-US), France (FR-FR) with localized legal frameworks
- **Accessibility**: font size (12–32px), high contrast, audio output, simplified navigation

---

## Architecture

```
User Browser
    |
    v
Next.js 16 Frontend (Cloudflare Pages)
    |
    | POST /api/documents/{text|upload|audio}
    v
Hono API (Cloudflare Workers)
    |
    | Store document -> Supabase DB + Storage
    | Trigger analysis -> POST /api/analyze/:documentId
    v
Multi-Agent AI Pipeline
    |
    |-- [1] Reader Agent (ministral-8b / pixtral-large)
    |       Extract and structure raw text from any input
    |
    |-- [2] Legal Triage Agent (ministral-8b)
    |       Classify document type, legal area, and country framework
    |
    |-- [3] Simplifier Agent (mistral-large)
    |       Produce plain-language analysis with abuse score
    |
    |-- [4] Audio Agent (ElevenLabs TTS)
    |       Generate spoken summary (cached in KV)
    |
    v
Results displayed in frontend
    |-- Optional: Q&A Agent (ministral-8b), follow-up questions
    |-- Optional: Document Generation (mistral-large), legal letters
    |-- Optional: Share card generation (SVG -> PNG)
```

### Multi-Agent AI Pipeline

| Agent | Model | Purpose | Input | Output |
|-------|-------|---------|-------|--------|
| **Reader** | `ministral-8b-latest` / `pixtral-large-latest` | Parse any input into structured document | URL, text, PDF, image, audio transcript | `StructuredDocument` (title, type, issuer, sections) |
| **Legal Triage** | `ministral-8b-latest` | Classify legal area and analysis pathway | First 2000 tokens of document | `LegalContext` (area, applicable laws, analysis type override) |
| **Simplifier** | `mistral-large-latest` | Core analysis, plain-language breakdown | Full document + legal context | ToS / Scam / General result with scores and clauses |
| **Audio** | ElevenLabs `eleven_multilingual_v2` | Generate spoken narration | Analysis summary text | MP3 audio (cached 30 days in KV + Supabase Storage) |
| **Q&A** | `ministral-8b-latest` | Answer user questions grounded in document | Question + document + summary | Answer with cited source excerpt |

#### Analysis Types (Auto-Detected by Legal Triage)

| Type | Triggered By | Output |
|------|-------------|--------|
| **Terms of Service** | Digital contracts, T&Cs, privacy policies | Abuse score (0–10), abusive clauses with severity + legal basis, positive points, recommendation |
| **Scam Detection** | Suspicious messages, phishing, fraud | Classification (scam/suspicious/legitimate), confidence %, alert signals, reporting contacts |
| **General** | Government letters, judicial notices, employment contracts | Executive summary, critical points with urgency, recommended actions with deadlines |

#### Cost Tracking

Every analysis tracks token usage and cost in USD:

| Model | Input ($/M tokens) | Output ($/M tokens) |
|-------|--------------------:|--------------------:|
| `ministral-8b-latest` | $0.10 | $0.10 |
| `mistral-large-latest` | $2.00 | $6.00 |
| `pixtral-large-latest` | $2.00 | $6.00 |

---

## Tech Stack

### Frontend

| Technology | Version | Usage |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Language |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styling |
| [daisyUI](https://daisyui.com/) | v5 | UI Components |
| [Framer Motion](https://www.framer.com/motion/) | v12 | Animations |
| [i18next](https://www.i18next.com/) | v25 | Internationalization |
| [Supabase JS](https://supabase.com/) | v2 | Auth & Storage (client) |
| [@opennextjs/cloudflare](https://opennext.js.org/) | v1 | Cloudflare Pages deployment |

### Backend

| Technology | Version | Usage |
|---|---|---|
| [Hono](https://hono.dev/) | v4.7 | HTTP Framework |
| [Cloudflare Workers](https://workers.cloudflare.com/) | — | Runtime & Deploy |
| [Mistral AI](https://mistral.ai/) | v1.5 | Multi-agent document analysis |
| [ElevenLabs](https://elevenlabs.io/) | — | Text-to-Speech & Speech-to-Text |
| [Supabase](https://supabase.com/) | — | PostgreSQL Database, Auth & Storage |
| [Zod](https://zod.dev/) | v3.24 | Schema Validation |
| [Cloudflare KV](https://developers.cloudflare.com/kv/) | — | Cache (audio, share cards) & Rate Limiting |

### AI Models (Mistral)

| Model | Usage |
|---|---|
| **Ministral 8B** | Fast text extraction, legal triage, Q&A |
| **Mistral Large** | Complex analysis, legal document generation |
| **Pixtral Large** | Image and PDF OCR (multimodal vision) |

---

## Country Support & Legal Frameworks

Each analysis cites the exact laws applicable to the user's jurisdiction.

### Brazil (PT-BR)

- **Consumer Protection:** Codigo de Defesa do Consumidor (CDC, Lei 8.078/90), Decreto 7.962/13
- **Data Privacy:** LGPD (Lei 13.709/18), Marco Civil da Internet (Lei 12.965/14)
- **Digital:** Lei de Crimes Ciberneticos (Lei 12.737/12)
- **Agencies:** PROCON, ANPD, Banco Central, SaferNet Brasil

### United States (EN-US)

- **Consumer Protection:** FTC Act (15 U.S.C. 41-58), state UDAP laws, Magnuson-Moss Warranty Act
- **Data Privacy:** CCPA/CPRA, COPPA, HIPAA, GLBA
- **Digital:** Section 230 CDA, DMCA, CFAA, CAN-SPAM
- **Agencies:** FTC, FBI IC3, BBB, State Attorneys General

### France (FR-FR)

- **Consumer Protection:** Code de la consommation, Loi Hamon, Loi Chatel
- **Data Privacy:** RGPD (EU 2016/679), Loi Informatique et Libertes
- **Digital:** LCEN (Loi 2004-575)
- **Agencies:** DGCCRF, CNIL, Pharos, Signal-Spam

---

## Accessibility & Age-Adaptive UI

The interface automatically adapts based on the user's age profile, configured during onboarding:

| Property | Young (18-34) | Adult (35-54) | Senior (55+) |
|----------|:---:|:---:|:---:|
| Base font size | 16px | 17px | **22px** |
| Button height | 2.5rem | 2.75rem | **3.5rem** |
| Line height | 1.5 | 1.6 | **1.8** |
| Transition speed | 150ms | 200ms | **300ms** |
| Audio by default | No | No | **Yes** |
| Guidance text | No | No | **Yes** |
| Simplified nav | No | No | **Yes** |
| High contrast | No | No | **Auto** |

**Senior mode** automatically enables: larger tap targets, guidance alert banners, audio-first output (text + audio), simplified navigation, fundamental simplification level (simplest language), and slower transitions.

All preferences are configurable in Settings regardless of age group.

---

## Project Structure

```
InclusivAI/
├── src/                        # Frontend (Next.js)
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── analyze/            # 5-mode document input
│   │   ├── processing/         # Upload + pipeline trigger
│   │   ├── confirmation/       # Document type confirmation
│   │   ├── results/            # Analysis results + Q&A + share
│   │   ├── analyses/           # Analysis history + detail view
│   │   ├── ranking/            # Company abuse leaderboard
│   │   ├── onboarding/         # 6-step onboarding wizard
│   │   ├── settings/           # User preferences
│   │   ├── login/ & signup/    # Authentication
│   │   └── share/[id]/         # Public shareable analysis
│   ├── components/             # Reusable components
│   │   ├── AnalysisResults.tsx # Score gauge, clause cards, scam/general results
│   │   ├── AudioPlayer.tsx     # TTS player with on-demand generation
│   │   ├── QAPanel.tsx         # Follow-up Q&A interface
│   │   ├── Navbar.tsx          # Navigation (transparent + solid variants)
│   │   └── onboarding/        # 6 onboarding step components
│   ├── contexts/               # React contexts (Auth, App, Experience, Language)
│   ├── lib/                    # API client, Supabase, experience profiles, i18n
│   └── types/                  # TypeScript types
│
├── backend/                    # Backend (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts            # Main Hono app
│   │   ├── routes/             # API routes (auth, documents, analyze, ranking, share)
│   │   ├── agents/             # AI pipeline (reader, legal-triage, simplifier, audio, questions)
│   │   ├── prompts/            # Country-specific prompts + legal frameworks
│   │   ├── services/           # Mistral, ElevenLabs, Supabase, PDF, URL fetcher
│   │   └── middleware/         # Auth (JWT) & Rate Limiting (KV)
│   ├── migrations/             # 11 SQL migrations (Supabase)
│   └── wrangler.toml           # Cloudflare Workers config
│
├── pitch/                      # Pitch video (Remotion, 8 animated scenes)
├── public/locales/             # Translations (pt-BR, en-US, fr-FR)
├── docs/                       # Technical documentation
└── .github/workflows/          # CI/CD (frontend & backend deploy)
```

---

## User Flow

```
1. Sign Up/Login  ->  2. Onboarding (country, age, accessibility)  ->  3. Document input
        |                                                                       |
        |                    +--------------------------------------------------+
        |                    |
        |              +-----+-----+
        |              |   Input    |
        |              |  methods   |
        |              +-----+-----+
        |          +----+----+----+----+
        |         Text  PDF  Photo URL Audio
        |          +----+----+----+----+
        |                    |
        |         4. Processing (AI Pipeline)
        |            Reader -> Legal Triage -> Simplifier
        |                    |
        |         5. Results
        |            Protection Score - Abusive Clauses - Recommendations
        |                    |
        |         6. Actions
        |            Audio - Q&A - Legal Documents - Share
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- [Supabase](https://supabase.com/) account
- [Cloudflare](https://cloudflare.com/) account (for deployment)
- [Mistral AI](https://console.mistral.ai/) API Key
- [ElevenLabs](https://elevenlabs.io/) API Key (for audio)

### 1. Clone the repository

```bash
git clone https://github.com/bbu-labs/InclusivAI.git
cd InclusivAI
```

### 2. Set up the Frontend

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

```bash
# Start the development server
npm run dev
```

Access [http://localhost:3000](http://localhost:3000).

### 3. Set up the Backend

```bash
cd backend
npm install

# Configure secrets (Wrangler CLI)
npx wrangler secret put MISTRAL_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put SHARE_HASH_SECRET

# Start the development server
npm run dev
```

The backend runs at [http://localhost:8787](http://localhost:8787).

### 4. Set up the Database

1. Create a project on [Supabase](https://supabase.com/)
2. Run the migrations in order in the SQL Editor:

```bash
# Files in backend/migrations/
001_enums.sql
002_profiles.sql
003_documents.sql
004_analyses.sql
005_questions.sql
006_rankings.sql
007_rls_policies.sql
008_increment_analyses.sql
009_has_onboarded.sql
010_audio_source_type.sql
011_profiles_country_language.sql
```

3. Create the buckets in Supabase Storage:
   - `uploads` (private): for uploaded documents
   - `audio` (public): for audio narrations

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run build:cf` | Build for Cloudflare Pages (OpenNext) |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Local server with Wrangler (localhost:8787) |
| `npm run deploy` | Deploy to Cloudflare Workers |

---

## API

The REST API is documented with OpenAPI 3.0 at [`/api/docs`](https://inclusive-api.bbu.app.br/api/docs). Also see [`docs/api.md`](docs/api.md).

### Main Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Create account |
| `POST` | `/api/auth/login` | No | Login |
| `GET` | `/api/auth/me` | Yes | Current user + profile |
| `PATCH` | `/api/auth/profile` | Yes | Update profile preferences |
| `POST` | `/api/documents/text` | Yes | Submit text document |
| `POST` | `/api/documents/upload` | Yes | Upload file (PDF/image) |
| `POST` | `/api/documents/audio` | Yes | Upload audio for transcription |
| `POST` | `/api/analyze/:documentId` | Yes | Run AI analysis pipeline |
| `GET` | `/api/analyze/:analysisId` | Yes | Get analysis result |
| `POST` | `/api/analyze/:analysisId/audio` | Yes | Generate TTS audio narration |
| `POST` | `/api/analyze/:analysisId/ask` | Yes | Ask a question about the document |
| `GET` | `/api/analyses` | Yes | List user's analyses |
| `GET` | `/api/ranking` | No | Company abuse leaderboard |
| `GET` | `/api/share/:id/image` | HMAC | Share card image |

Authentication via Bearer token (Supabase JWT) in the `Authorization` header.

---

## Deployment

### Frontend (Cloudflare Pages)

```bash
npm run build:cf
```

Automatic deployment via GitHub Actions (`.github/workflows/deploy-frontend.yml`).

### Backend (Cloudflare Workers)

```bash
cd backend
npx wrangler deploy
```

Automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`).

### Production URLs

- **Frontend:** [clausulaoculta.com.br](https://clausulaoculta.com.br)
- **API:** [inclusive-api.bbu.app.br](https://inclusive-api.bbu.app.br)

---

## Plans and Limits

| Resource | Free | Premium |
|---|---|---|
| Analyses per month | 10 | 100 |
| Audio generation | 5/month | Unlimited |
| Questions per document | 5 | 20 |
| Legal document generation | 3/month | 30/month |

Rate limiting uses Cloudflare KV sliding windows keyed by user ID.

---

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User preferences, age range, plan, usage counters (extends `auth.users`) |
| `documents` | Uploaded documents with extracted text and structured data |
| `analyses` | AI analysis results: summary JSONB, abuse score, token/cost tracking |
| `questions` | Q&A history per analysis with cited source excerpts |
| `company_rankings` | Aggregated company abuse scores (rolling average) |

All tables enforce Row-Level Security (RLS). Analysis writes use a service role client that bypasses RLS.

---

## Documentation

- [`docs/api.md`](docs/api.md): Full API reference
- [`docs/deploy-guide.md`](docs/deploy-guide.md): Deployment guide
- [`docs/backend-plan.md`](docs/backend-plan.md): Implementation roadmap
- [`docs/frontend-integration.md`](docs/frontend-integration.md): Frontend integration

---

## Contributing

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project was developed for the **Mistral AI Hackathon 2026** by **BBU Labs**.

---

<p align="center">
  <strong>Clausula Oculta</strong> | Information is the best defense for consumers. Let's democratize it.
</p>
