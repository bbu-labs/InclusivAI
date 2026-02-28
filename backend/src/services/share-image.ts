import type { MistralClient } from "./mistral";
import { MINISTRAL_8B } from "./mistral";

const ANALYSIS_TYPE_LABELS: Record<string, string> = {
  tos: "Termos de Uso",
  scam: "Detecção de Golpe",
  general: "Análise Geral",
};

// ─── Mistral social summary ───

interface SocialSummary {
  frase_compartilhamento: string;
}

export async function generateSocialSummary(
  mistralClient: MistralClient,
  analysisType: string,
  score: number | null,
  rawSummary: string
): Promise<string> {
  const scoreText = score !== null ? `Nota de proteção: ${Math.round((1 - score / 10) * 100)}/100.` : "";

  const { data } = await mistralClient.chatJSON<SocialSummary>(
    MINISTRAL_8B,
    [
      {
        role: "system",
        content: `Você é um redator que cria frases curtas e impactantes para compartilhamento em redes sociais.
Gere UMA frase de 1-2 sentenças em português brasileiro que resuma a análise de forma convincente para compartilhar.
A frase deve alertar e informar, sem ser alarmista.
Responda SOMENTE em JSON: { "frase_compartilhamento": "..." }`,
      },
      {
        role: "user",
        content: `Tipo de análise: ${ANALYSIS_TYPE_LABELS[analysisType] || analysisType}
${scoreText}
Resumo da análise: ${rawSummary.slice(0, 500)}`,
      },
    ],
    256
  );

  return data.frase_compartilhamento;
}

// ─── Render SVG card as string (no WASM, CF Workers compatible) ───

function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Boa Proteção";
  if (score >= 40) return "Atenção Necessária";
  return "Alto Risco";
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wrap text into lines that fit within a given character limit */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function renderShareCardSvg(opts: {
  documentTitle: string;
  analysisType: string;
  protectionScore: number;
  socialSummary: string;
  date: string;
}): string {
  const { documentTitle, analysisType, protectionScore, socialSummary, date } = opts;

  const scoreColor = getScoreColor(protectionScore);
  const scoreLabel = getScoreLabel(protectionScore);
  const typeLabel = ANALYSIS_TYPE_LABELS[analysisType] || analysisType;
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");
  const truncatedTitle =
    documentTitle.length > 55 ? documentTitle.slice(0, 52) + "..." : documentTitle;

  // Wrap social summary into lines (~65 chars per line at 22px font)
  const summaryLines = wrapText(
    socialSummary.length > 200 ? socialSummary.slice(0, 197) + "..." : socialSummary,
    65
  ).slice(0, 3);

  // Wrap title into lines (~30 chars per line at 36px font)
  const titleLines = wrapText(truncatedTitle, 30).slice(0, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#156579"/>
      <stop offset="60%" stop-color="#0f3d4d"/>
      <stop offset="100%" stop-color="#0a2a35"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Analysis type badge -->
  <rect x="60" y="55" width="${typeLabel.length * 10 + 32}" height="34" rx="8" fill="rgba(255,255,255,0.15)"/>
  <text x="76" y="78" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="white">${escapeXml(typeLabel)}</text>

  <!-- Document title -->
  ${titleLines.map((line, i) =>
    `<text x="60" y="${130 + i * 44}" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="white">${escapeXml(line)}</text>`
  ).join("\n  ")}

  <!-- Score circle -->
  <circle cx="1060" cy="130" r="70" fill="none" stroke="${scoreColor}" stroke-width="6"/>
  <text x="1060" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="${scoreColor}" text-anchor="middle">${protectionScore}</text>
  <text x="1060" y="162" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle">/100</text>
  <text x="1060" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="${scoreColor}" text-anchor="middle">${escapeXml(scoreLabel)}</text>

  <!-- Social summary -->
  ${summaryLines.map((line, i) =>
    `<text x="60" y="${370 + i * 32}" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="rgba(255,255,255,0.85)">${escapeXml(line)}</text>`
  ).join("\n  ")}

  <!-- Brand -->
  <text x="60" y="545" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#5cbfcf">Cláusula Oculta</text>
  <text x="60" y="570" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)">Analise seu documento em clausulaoculta.com.br</text>

  <!-- Date -->
  <text x="1140" y="570" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.4)" text-anchor="end">${escapeXml(formattedDate)}</text>
</svg>`;
}
