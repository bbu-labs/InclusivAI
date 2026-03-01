import { runAgent, type AgentResult } from "./base";
import { TOS_ANALYSIS_SYSTEM_PROMPT, TOS_ANALYSIS_USER_PROMPT } from "../prompts/tos-analysis";
import { buildScamDetectionPrompt, buildScamDetectionUserPrompt } from "../prompts/scam-detection";
import { GENERAL_SIMPLIFIER_SYSTEM_PROMPT, GENERAL_SIMPLIFIER_USER_PROMPT } from "../prompts/simplifier";
import { MISTRAL_LARGE, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";
import type { AnalysisType, SimplificationLevel, SupportedCountry } from "../types";
import type { LegalContext } from "../prompts/legal-triage";

const INPUT_TOKEN_LIMIT = 8000;
const OUTPUT_TOKEN_LIMIT = 4096;

export type TosAnalysisResult = {
  abusividade: number;
  resumo: string;
  clausulas_abusivas: Array<{
    texto_original: string;
    explicacao_simples: string;
    base_legal: string;
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
  documentText: string,
  legalContext?: LegalContext,
  country: SupportedCountry = "BR"
): { system: string; user: string } {
  const truncated = truncateToTokens(documentText, INPUT_TOKEN_LIMIT);

  switch (analysisType) {
    case "tos":
      return {
        system: TOS_ANALYSIS_SYSTEM_PROMPT(level, legalContext, country),
        user: TOS_ANALYSIS_USER_PROMPT(truncated, country),
      };
    case "scam":
      return {
        system: buildScamDetectionPrompt(country),
        user: buildScamDetectionUserPrompt(truncated, country),
      };
    case "general":
      return {
        system: GENERAL_SIMPLIFIER_SYSTEM_PROMPT(level, legalContext, country),
        user: GENERAL_SIMPLIFIER_USER_PROMPT(truncated, country),
      };
  }
}

export function simplifyDocument(
  documentText: string,
  analysisType: AnalysisType,
  simplificationLevel: SimplificationLevel,
  mistralClient: MistralClient,
  legalContext?: LegalContext,
  country: SupportedCountry = "BR"
): Promise<AgentResult<SimplifierResult>> {
  const { system, user } = getPrompts(analysisType, simplificationLevel, documentText, legalContext, country);

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
