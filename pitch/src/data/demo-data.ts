export const demoScore = 32;

export const demoClauses = [
  {
    id: 1,
    severity: "Alta" as const,
    legalRef: "Art. 51 CDC",
    explanation:
      "Cláusula permite alteração unilateral dos termos sem aviso prévio ao consumidor, violando o direito à informação adequada.",
    badgeColor: "#ef4444",
  },
  {
    id: 2,
    severity: "Alta" as const,
    legalRef: "Art. 18 LGPD",
    explanation:
      "Compartilhamento de dados pessoais com terceiros sem consentimento específico do titular, violando princípio de finalidade.",
    badgeColor: "#ef4444",
  },
  {
    id: 3,
    severity: "Média" as const,
    legalRef: "Art. 46 CDC",
    explanation:
      "Foro de eleição em cidade diferente do domicílio do consumidor, dificultando acesso à justiça em caso de litígio.",
    badgeColor: "#f59e0b",
  },
];

export const demoDocTitle = "Termos de Uso — Nubank";
export const demoDocType = "Termos de Serviço";

export const processingSteps = [
  { id: "upload", label: "Enviando documento...", icon: "IoDocumentText" },
  { id: "extract", label: "Extraindo texto...", icon: "IoScan" },
  { id: "clean", label: "Processando conteúdo...", icon: "IoColorWand" },
  { id: "identify", label: "Identificando tipo...", icon: "IoSearch" },
] as const;

export const inputModes = [
  { id: "url", icon: "IoLink", title: "Link / URL", subtitle: "Cole um link" },
  {
    id: "text",
    icon: "IoDocumentText",
    title: "Colar texto",
    subtitle: "Cole o texto",
  },
  {
    id: "upload",
    icon: "IoDocument",
    title: "Arquivo",
    subtitle: "PDF, DOC, TXT",
  },
  {
    id: "camera",
    icon: "IoCamera",
    title: "Câmera / Foto",
    subtitle: "Tire uma foto",
  },
  {
    id: "audio",
    icon: "IoMic",
    title: "Gravar áudio",
    subtitle: "Grave sua voz",
  },
] as const;

export const pipelineAgents = [
  { name: "Reader", description: "Text Extraction", model: "ministral-8b" },
  {
    name: "Legal Triage",
    description: "Document Classification",
    model: "mistral-large",
  },
  {
    name: "Simplifier",
    description: "Plain Language Analysis",
    model: "mistral-large",
  },
  {
    name: "Audio",
    description: "Voice Summary",
    model: "elevenlabs",
  },
] as const;

export const techStack = [
  "Mistral AI",
  "Hono",
  "Next.js 16",
  "Cloudflare Workers",
  "Supabase",
  "ElevenLabs",
] as const;

export const countryData = [
  {
    code: "BR",
    flag: "🇧🇷",
    name: "Brasil",
    laws: ["Código de Defesa do Consumidor", "LGPD"],
  },
  {
    code: "US",
    flag: "🇺🇸",
    name: "United States",
    laws: ["FTC Act", "CCPA"],
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "France",
    laws: ["Code de la consommation", "RGPD"],
  },
] as const;
