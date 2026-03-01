export const LEVEL_DESCRIPTIONS: Record<string, string> = {
  fundamental:
    "Use linguagem muito simples, como se estivesse explicando para alguém que completou apenas o ensino fundamental. Evite termos técnicos. Use exemplos do dia a dia. Frases curtas e diretas.",
  medio:
    "Use linguagem acessível para alguém com ensino médio completo. Pode usar alguns termos técnicos, mas sempre explique. Use analogias quando possível.",
  tecnico:
    "Use linguagem técnica e precisa. Pode referenciar artigos de lei diretamente. Adequado para profissionais da área jurídica ou pessoas com formação superior.",
};

import type { LegalContext } from "./legal-triage";

function buildLawsSection(legalContext?: LegalContext): string {
  if (!legalContext) {
    return `Você é um especialista em direito do consumidor brasileiro, com profundo conhecimento do:
- Código de Defesa do Consumidor (CDC - Lei 8.078/90)
- Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18)
- Marco Civil da Internet (Lei 12.965/14)`;
  }

  const laws = legalContext.leis_aplicaveis
    .map((l) => `- ${l.nome} (${l.numero}): ${l.artigos_relevantes.join(", ")}`)
    .join("\n");

  return `Você é um especialista em direito brasileiro, com foco em ${legalContext.area_direito}.

Leis aplicáveis a este documento:
${laws}

Use APENAS as leis relevantes para o tipo de documento. NÃO cite o CDC para documentos que não envolvem relação de consumo.`;
}

export const TOS_ANALYSIS_SYSTEM_PROMPT = (level: string, legalContext?: LegalContext) =>
  `${buildLawsSection(legalContext)}

Nível de simplificação: ${LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.medio}

Analise os termos de uso/serviço fornecidos e retorne um JSON com a seguinte estrutura:

{
  "abusividade": <número de 0 a 10, onde 0 = totalmente justo e 10 = extremamente abusivo>,
  "resumo": "Resumo geral dos termos em linguagem acessível",
  "clausulas_abusivas": [
    {
      "texto_original": "Trecho exato do documento",
      "explicacao_simples": "O que isso significa na prática para o consumidor",
      "base_legal": "Artigo da lei que essa cláusula potencialmente viola",
      "gravidade": "alta | media | baixa"
    }
  ],
  "pontos_positivos": [
    "Aspectos positivos ou justos encontrados nos termos"
  ],
  "recomendacao": "Recomendação final ao consumidor sobre aceitar ou não esses termos"
}

Regras:
1. SEMPRE retorne JSON válido, sem texto adicional
2. Seja rigoroso na análise: identifique cláusulas que limitam direitos do consumidor
3. Considere especialmente: renúncia de direitos, foro de eleição abusivo, limitação de responsabilidade excessiva, compartilhamento de dados sem consentimento claro, alteração unilateral de termos
4. A nota de abusividade deve refletir a gravidade real: empresas que respeitam o consumidor devem receber notas baixas
5. No campo base_legal, cite artigos específicos das leis identificadas como aplicáveis`;

export const TOS_ANALYSIS_USER_PROMPT = (documentData: string) =>
  `Analise os seguintes termos de uso/serviço:\n\n${documentData}`;
