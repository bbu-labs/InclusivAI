import { runAgent, type AgentResult } from "./base";
import { TOS_ANALYSIS_SYSTEM_PROMPT, TOS_ANALYSIS_USER_PROMPT } from "../prompts/tos-analysis";
import { SCAM_DETECTION_SYSTEM_PROMPT, SCAM_DETECTION_USER_PROMPT } from "../prompts/scam-detection";
import { GENERAL_SIMPLIFIER_SYSTEM_PROMPT, GENERAL_SIMPLIFIER_USER_PROMPT } from "../prompts/simplifier";
import { MISTRAL_LARGE, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";
import type { AnalysisType, SimplificationLevel } from "../types";

const INPUT_TOKEN_LIMIT = 8000;
const OUTPUT_TOKEN_LIMIT = 2048;

export type TosAnalysisResult = {
  abusividade: number;
  resumo: string;
  clausulas_abusivas: Array<{
    texto_original: string;
    explicacao_simples: string;
    artigo_cdc: string;
    gravidade: "alta" | "media" | "baixa";
  }>;
  pontos_positivos: string[];
  recomendacao: string;
};

export type ScamDetectionResult = {
  classificacao: "golpe_provavel" | "suspeito" | "aparentemente_legitimo";
  confianca: number;
  sinais_alerta: string[];
  explicacao: string;
  acao_recomendada: string;
  onde_denunciar: Array<{
    orgao: string;
    como: string;
    contato: string;
  }>;
};

export type GeneralSimplifierResult = {
  resumo_executivo: string;
  pontos_criticos: Array<{
    item: string;
    explicacao: string;
    urgencia: "alta" | "media" | "baixa";
  }>;
  acoes_recomendadas: Array<{
    acao: string;
    prazo: string;
    como_fazer: string;
  }>;
  prazos: Array<{
    descricao: string;
    data_limite: string;
    consequencia: string;
  }>;
  base_legal: Array<{
    lei: string;
    artigo: string;
    relevancia: string;
  }>;
};

export type SimplifierResult = TosAnalysisResult | ScamDetectionResult | GeneralSimplifierResult;

function getPrompts(
  analysisType: AnalysisType,
  level: SimplificationLevel,
  documentText: string
): { system: string; user: string } {
  const truncated = truncateToTokens(documentText, INPUT_TOKEN_LIMIT);

  switch (analysisType) {
    case "tos":
      return {
        system: TOS_ANALYSIS_SYSTEM_PROMPT(level),
        user: TOS_ANALYSIS_USER_PROMPT(truncated),
      };
    case "scam":
      return {
        system: SCAM_DETECTION_SYSTEM_PROMPT,
        user: SCAM_DETECTION_USER_PROMPT(truncated),
      };
    case "general":
      return {
        system: GENERAL_SIMPLIFIER_SYSTEM_PROMPT(level),
        user: GENERAL_SIMPLIFIER_USER_PROMPT(truncated),
      };
  }
}

export function simplifyDocument(
  documentText: string,
  analysisType: AnalysisType,
  simplificationLevel: SimplificationLevel,
  mistralClient: MistralClient
): Promise<AgentResult<SimplifierResult>> {
  const { system, user } = getPrompts(analysisType, simplificationLevel, documentText);

  return runAgent<SimplifierResult>(MISTRAL_LARGE, () =>
    mistralClient.chatJSON<SimplifierResult>(
      MISTRAL_LARGE,
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}
