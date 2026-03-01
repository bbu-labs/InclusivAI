import { runAgent, type AgentResult } from "./base";
import { MINISTRAL_8B, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";
import type { SupportedCountry } from "../types";
import { getFramework } from "../prompts/legal-frameworks";

const CONTEXT_TOKEN_LIMIT = 4000;
const OUTPUT_TOKEN_LIMIT = 1024;

function buildQAPrompt(country: SupportedCountry = "BR"): string {
  const fw = getFramework(country);

  if (country === "US") {
    return `You are a specialist assistant in U.S. consumer protection law. Answer questions ONLY based on the provided document and the analysis already performed.

${fw.languageInstruction}

Rules:
1. ALWAYS return valid JSON with the structure: { "answer": "...", "source_excerpt": "..." }
2. If the question cannot be answered based on the document, respond: { "answer": "I couldn't find information about that in the analyzed document.", "source_excerpt": null }
3. Cite the exact excerpt from the document that supports your answer in "source_excerpt"
4. Use simple, accessible language
5. Do not invent information that is not in the document
6. If relevant, mention sections of the ${fw.consumerProtection.primaryLaw}, ${fw.dataPrivacy.primaryLaw}, or ${fw.internetDigital.primaryLaw} that apply`;
  }

  if (country === "FR") {
    return `Vous êtes un assistant spécialisé en droit de la consommation français. Répondez aux questions UNIQUEMENT sur la base du document fourni et de l'analyse déjà effectuée.

${fw.languageInstruction}

Règles :
1. TOUJOURS retourner du JSON valide avec la structure : { "answer": "...", "source_excerpt": "..." }
2. Si la question ne peut pas être répondue sur la base du document, répondez : { "answer": "Je n'ai pas trouvé d'information à ce sujet dans le document analysé.", "source_excerpt": null }
3. Citez l'extrait exact du document qui étaye votre réponse dans "source_excerpt"
4. Utilisez un langage simple et accessible
5. N'inventez pas d'informations qui ne sont pas dans le document
6. Si pertinent, mentionnez les articles du ${fw.consumerProtection.primaryLaw}, ${fw.dataPrivacy.primaryLaw} ou ${fw.internetDigital.primaryLaw} qui s'appliquent`;
  }

  return `Você é um assistente especializado em direito do consumidor brasileiro. Responda perguntas APENAS com base no documento fornecido e na análise já realizada.

${fw.languageInstruction}

Regras:
1. SEMPRE retorne JSON válido com a estrutura: { "answer": "...", "source_excerpt": "..." }
2. Se a pergunta não pode ser respondida com base no documento, responda: { "answer": "Não encontrei informação sobre isso no documento analisado.", "source_excerpt": null }
3. Cite o trecho exato do documento que fundamenta sua resposta em "source_excerpt"
4. Use linguagem simples e acessível
5. Não invente informações que não estão no documento
6. Se relevante, mencione artigos do CDC, LGPD ou Marco Civil que se aplicam`;
}

function buildQAUserMessage(question: string, documentText: string, analysisSummary: string, country: SupportedCountry = "BR"): string {
  if (country === "US") {
    return `## Analyzed document:
${documentText}

## Analysis summary:
${analysisSummary}

## User question:
${question}`;
  }

  if (country === "FR") {
    return `## Document analysé :
${documentText}

## Résumé de l'analyse :
${analysisSummary}

## Question de l'utilisateur :
${question}`;
  }

  return `## Documento analisado:
${documentText}

## Resumo da análise:
${analysisSummary}

## Pergunta do usuário:
${question}`;
}

export type QAResult = {
  answer: string;
  source_excerpt: string | null;
};

export function askQuestion(
  question: string,
  documentText: string,
  analysisSummary: string,
  mistralClient: MistralClient,
  country: SupportedCountry = "BR"
): Promise<AgentResult<QAResult>> {
  const truncatedDoc = truncateToTokens(documentText, CONTEXT_TOKEN_LIMIT);
  const truncatedSummary = truncateToTokens(analysisSummary, 1000);

  const systemPrompt = buildQAPrompt(country);
  const userMessage = buildQAUserMessage(question, truncatedDoc, truncatedSummary, country);

  return runAgent<QAResult>(MINISTRAL_8B, () =>
    mistralClient.chatJSON<QAResult>(
      MINISTRAL_8B,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}
