import satori from "satori";
import type { MistralClient } from "./mistral";
import { MINISTRAL_8B } from "./mistral";
import { loadFonts } from "./fonts";

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

// ─── Render SVG card (satori works natively in CF Workers) ───

function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Boa Protecao";
  if (score >= 40) return "Atencao Necessaria";
  return "Alto Risco";
}

export async function renderShareCardSvg(opts: {
  documentTitle: string;
  analysisType: string;
  protectionScore: number;
  socialSummary: string;
  date: string;
  kv: KVNamespace;
}): Promise<string> {
  const { documentTitle, analysisType, protectionScore, socialSummary, date, kv } = opts;

  const scoreColor = getScoreColor(protectionScore);
  const scoreLabel = getScoreLabel(protectionScore);
  const typeLabel = ANALYSIS_TYPE_LABELS[analysisType] || analysisType;
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");
  const truncatedTitle =
    documentTitle.length > 60 ? documentTitle.slice(0, 57) + "..." : documentTitle;

  const fonts = await loadFonts(kv);

  const card = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        background: "linear-gradient(135deg, #156579 0%, #0f3d4d 60%, #0a2a35 100%)",
        fontFamily: "Inter",
        color: "white",
      },
      children: [
        // Top section
        {
          type: "div",
          props: {
            style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
            children: [
              // Left: title + badge
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", flex: 1, marginRight: "40px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "20px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                background: "rgba(255,255,255,0.15)",
                                borderRadius: "8px",
                                padding: "6px 16px",
                                fontSize: "16px",
                                fontWeight: 700,
                              },
                              children: typeLabel,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "36px",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          marginBottom: "16px",
                        },
                        children: truncatedTitle,
                      },
                    },
                  ],
                },
              },
              // Right: score circle
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "140px",
                          height: "140px",
                          borderRadius: "70px",
                          border: `6px solid ${scoreColor}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "48px",
                                fontWeight: 700,
                                color: scoreColor,
                                lineHeight: 1,
                              },
                              children: String(protectionScore),
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                              },
                              children: "/100",
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "14px",
                          fontWeight: 700,
                          color: scoreColor,
                          marginTop: "8px",
                        },
                        children: scoreLabel,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Social summary
        {
          type: "div",
          props: {
            style: {
              fontSize: "22px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.85)",
              maxHeight: "100px",
              overflow: "hidden",
            },
            children: socialSummary,
          },
        },
        // Bottom: CTA + date + brand
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: "4px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#5cbfcf",
                        },
                        children: "Clausula Oculta",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "14px",
                          color: "rgba(255,255,255,0.5)",
                        },
                        children: "Analise seu documento em clausulaoculta.com.br",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.4)",
                  },
                  children: formattedDate,
                },
              },
            ],
          },
        },
      ],
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return satori(card as any, {
    width: 1200,
    height: 630,
    fonts,
  });
}
