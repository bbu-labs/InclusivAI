# Hidden Clause - InclusivAI

**AI system for Brazilian consumer protection** that transforms official, legal, and contractual documents into accessible language for people with different levels of digital literacy.

> Project developed for the **Mistral Hackathon 2026**

---

## About the Project

**Hidden Clause** analyzes complex documents — Terms of Service, contracts, INSS letters, court notices, and suspicious messages — and translates them into simple, accessible, and understandable language. The system uses AI agents (Mistral) to extract text, classify document types, identify abusive clauses, detect scams, and generate legal consumer defense documents.

### Key Features

- **Document analysis** with abusiveness score (0-10) and scam detection
- **Multiple input methods**: text, PDF upload, photo/camera (OCR), URL
- **Accessible explanations** with adjustable simplification levels (basic, intermediate, technical)
- **Audio narration** of results via ElevenLabs
- **Q&A** about the analyzed document (RAG)
- **Legal document generation**: Procon complaints, Small Claims Court petitions, SAC letters
- **Company ranking** by abusiveness score
- **Sharing** of analyses with social media preview cards
- **Accessibility**: font size adjustment (12-32px), high contrast, audio
- **Multi-language**: Portuguese (BR), English (US), French (FR)

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

### Backend

| Technology | Version | Usage |
|---|---|---|
| [Hono](https://hono.dev/) | v4.7 | HTTP Framework |
| [Cloudflare Workers](https://workers.cloudflare.com/) | — | Runtime & Deploy |
| [Mistral AI](https://mistral.ai/) | v1.5 | Document Analysis |
| [ElevenLabs](https://elevenlabs.io/) | — | Text-to-Speech |
| [Supabase](https://supabase.com/) | — | Database & Auth |
| [Zod](https://zod.dev/) | v3.24 | Schema Validation |
| [Cloudflare KV](https://developers.cloudflare.com/kv/) | — | Cache & Rate Limiting |

### AI Models (Mistral)

| Model | Usage |
|---|---|
| **Ministral 8B** | Fast text extraction, Q&A |
| **Mistral Large 3** | Complex analysis, legal document generation |
| **Pixtral** | Image and PDF OCR (vision) |

---

## Project Structure

```
InclusivAI/
├── src/                        # Frontend (Next.js)
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── analyze/            # Input form
│   │   ├── processing/         # Processing screen
│   │   ├── results/            # Results display
│   │   ├── analyses/           # Analysis history
│   │   ├── ranking/            # Company ranking
│   │   ├── onboarding/         # Initial setup
│   │   ├── login/ & signup/    # Authentication
│   │   └── share/[id]/         # Shareable card
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts (Auth, Language, etc.)
│   ├── lib/                    # API client & Supabase
│   └── types/                  # TypeScript types
│
├── backend/                    # Backend (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts            # Main Hono app
│   │   ├── routes/             # API routes
│   │   ├── agents/             # AI analysis pipeline
│   │   ├── prompts/            # Model prompts
│   │   ├── services/           # Mistral, Supabase, ElevenLabs
│   │   └── middleware/         # Auth & Rate Limiting
│   ├── migrations/             # SQL migrations (Supabase)
│   └── wrangler.toml           # Cloudflare Workers config
│
├── pitch/                      # Pitch video (Remotion)
├── public/locales/             # Translations (pt-BR, en-US, fr-FR)
├── docs/                       # Technical documentation
└── .github/workflows/          # CI/CD (frontend & backend deploy)
```

---

## User Flow

```
1. Sign Up/Login  →  2. Onboarding (accessibility)  →  3. Document input
        │                                                        │
        │                    ┌───────────────────────────────────┘
        │                    │
        │              ┌─────┴─────┐
        │              │   Input    │
        │              │  methods   │
        │              └─────┬─────┘
        │          ┌────┬────┼────┬────┐
        │         Text  PDF  Photo URL Audio
        │          └────┴────┼────┴────┘
        │                    │
        │         4. Processing (AI)
        │            Reader → Triage → Simplifier
        │                    │
        │         5. Results
        │            Score · Clauses · Recommendations
        │                    │
        │         6. Actions
        │            Audio · Questions · Legal Document · Share
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
   - `uploads` (private) — for uploaded documents
   - `audio` (public) — for audio narrations

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

The REST API is documented in [`docs/api.md`](docs/api.md). Main endpoints:

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/login` | Login |
| `POST` | `/documents` | Submit document (text) |
| `POST` | `/documents/upload` | Upload file (PDF/image) |
| `POST` | `/analyze/:id` | Start analysis |
| `GET` | `/analyze/:id` | Get analysis result |
| `POST` | `/analyze/:id/audio` | Generate audio narration |
| `POST` | `/analyze/:id/ask` | Ask a question about the document |
| `POST` | `/analyze/:id/generate-document` | Generate legal document |
| `GET` | `/ranking` | Company ranking |
| `GET` | `/share/:hash` | Shareable card |

Authentication via Bearer token in the `Authorization` header.

---

## Deployment

### Frontend — Cloudflare Pages

```bash
npm run build:cf
```

Automatic deployment via GitHub Actions (`.github/workflows/deploy-frontend.yml`).

### Backend — Cloudflare Workers

```bash
cd backend
npx wrangler deploy
```

Automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`).

---

## Plans and Limits

| Resource | Free | Premium |
|---|---|---|
| Analyses per month | 10 | 100 |
| Audio generation | 5/month | Unlimited |
| Questions per document | 5 | 20 |
| Legal document generation | 3/month | 30/month |

---

## Documentation

- [`docs/api.md`](docs/api.md) — Full API reference
- [`docs/deploy-guide.md`](docs/deploy-guide.md) — Deployment guide
- [`docs/backend-plan.md`](docs/backend-plan.md) — Implementation roadmap
- [`docs/frontend-integration.md`](docs/frontend-integration.md) — Frontend integration

---

## Contributing

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project was developed for the **Mistral Hackathon 2026**.

---

<p align="center">
  Built for <strong>digital inclusion</strong> and <strong>consumer protection</strong> in Brazil.
</p>
