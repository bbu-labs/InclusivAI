import { runAgent, type AgentResult } from "./base";
import { MINISTRAL_8B, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";

const CONTEXT_TOKEN_LIMIT = 4000;
const OUTPUT_TOKEN_LIMIT = 1024;

const QA_SYSTEM_PROMPT = `Você é um assistente especializado em direito do consumidor brasileiro. Responda perguntas APENAS com base no documento fornecido e na análise já realizada.

Regras:
1. SEMPRE retorne JSON válido com a estrutura: { "answer": "...", "source_excerpt": "..." }
2. Se a pergunta não pode ser respondida com base no documento, responda: { "answer": "Não encontrei informação sobre isso no documento analisado.", "source_excerpt": null }
3. Cite o trecho exato do documento que fundamenta sua resposta em "source_excerpt"
4. Use linguagem simples e acessível
5. Não invente informações que não estão no documento
6. Se relevante, mencione artigos do CDC, LGPD ou Marco Civil que se aplicam`;

export type QAResult = {
  answer: string;
  source_excerpt: string | null;
};

export function askQuestion(
  question: string,
  documentText: string,
  analysisSummary: string,
  mistralClient: MistralClient
): Promise<AgentResult<QAResult>> {
  const truncatedDoc = truncateToTokens(documentText, CONTEXT_TOKEN_LIMIT);
  const truncatedSummary = truncateToTokens(analysisSummary, 1000);

  const userMessage = `## Documento analisado:
${truncatedDoc}

## Resumo da análise:
${truncatedSummary}

## Pergunta do usuário:
${question}`;

  return runAgent<QAResult>(MINISTRAL_8B, () =>
    mistralClient.chatJSON<QAResult>(
      MINISTRAL_8B,
      [
        { role: "system", content: QA_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}
