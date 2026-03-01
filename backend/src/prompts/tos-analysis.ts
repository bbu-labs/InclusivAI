import type { SupportedCountry } from "../types";
import type { LegalContext } from "./legal-triage";
import { getFramework } from "./legal-frameworks";

export const LEVEL_DESCRIPTIONS: Record<string, string> = {
  fundamental:
    "Use linguagem muito simples, como se estivesse explicando para alguém que completou apenas o ensino fundamental. Evite termos técnicos. Use exemplos do dia a dia. Frases curtas e diretas.",
  medio:
    "Use linguagem acessível para alguém com ensino médio completo. Pode usar alguns termos técnicos, mas sempre explique. Use analogias quando possível.",
  tecnico:
    "Use linguagem técnica e precisa. Pode referenciar artigos de lei diretamente. Adequado para profissionais da área jurídica ou pessoas com formação superior.",
};

const LEVEL_DESCRIPTIONS_EN: Record<string, string> = {
  fundamental:
    "Use very simple language, as if explaining to someone with only basic education. Avoid technical terms. Use everyday examples. Short, direct sentences.",
  medio:
    "Use accessible language for someone with a high school education. You may use some technical terms, but always explain them. Use analogies when possible.",
  tecnico:
    "Use technical, precise language. You may reference law sections directly. Suitable for legal professionals or people with higher education.",
};

const LEVEL_DESCRIPTIONS_FR: Record<string, string> = {
  fundamental:
    "Utilisez un langage très simple, comme si vous expliquiez à quelqu'un ayant uniquement un niveau d'éducation élémentaire. Évitez les termes techniques. Utilisez des exemples du quotidien. Phrases courtes et directes.",
  medio:
    "Utilisez un langage accessible pour quelqu'un ayant le niveau baccalauréat. Vous pouvez utiliser certains termes techniques, mais expliquez-les toujours. Utilisez des analogies.",
  tecnico:
    "Utilisez un langage technique et précis. Vous pouvez référencer directement les articles de loi. Adapté aux professionnels du droit ou aux personnes avec une formation supérieure.",
};

function getLevelDesc(level: string, country: SupportedCountry): string {
  if (country === "US") return LEVEL_DESCRIPTIONS_EN[level] || LEVEL_DESCRIPTIONS_EN.medio;
  if (country === "FR") return LEVEL_DESCRIPTIONS_FR[level] || LEVEL_DESCRIPTIONS_FR.medio;
  return LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.medio;
}

function buildLawsSection(legalContext: LegalContext | undefined, country: SupportedCountry): string {
  const fw = getFramework(country);

  if (legalContext) {
    const laws = legalContext.leis_aplicaveis
      .map((l) => `- ${l.nome} (${l.numero}): ${l.artigos_relevantes.join(", ")}`)
      .join("\n");

    if (country === "US") {
      return `You are a specialist in U.S. law, focused on ${legalContext.area_direito}.

Laws applicable to this document:
${laws}

Use ONLY the relevant laws for the document type. Do NOT cite consumer protection laws for non-consumer documents.`;
    }
    if (country === "FR") {
      return `Vous êtes un spécialiste du droit français, avec une expertise en ${legalContext.area_direito}.

Lois applicables à ce document :
${laws}

Utilisez UNIQUEMENT les lois pertinentes pour le type de document.`;
    }

    return `Você é um especialista em direito brasileiro, com foco em ${legalContext.area_direito}.

Leis aplicáveis a este documento:
${laws}

Use APENAS as leis relevantes para o tipo de documento. NÃO cite o CDC para documentos que não envolvem relação de consumo.`;
  }

  if (country === "US") {
    return `You are a specialist in U.S. consumer protection law, with deep knowledge of:
- ${fw.consumerProtection.primaryLaw}
- ${fw.dataPrivacy.primaryLaw}
- ${fw.internetDigital.primaryLaw}`;
  }
  if (country === "FR") {
    return `Vous êtes un spécialiste du droit de la consommation français, avec une connaissance approfondie de :
- ${fw.consumerProtection.primaryLaw}
- ${fw.dataPrivacy.primaryLaw}
- ${fw.internetDigital.primaryLaw}`;
  }

  return `Você é um especialista em direito do consumidor brasileiro, com profundo conhecimento do:
- ${fw.consumerProtection.primaryLaw}
- ${fw.dataPrivacy.primaryLaw}
- ${fw.internetDigital.primaryLaw}`;
}

export const TOS_ANALYSIS_SYSTEM_PROMPT = (level: string, legalContext?: LegalContext, country: SupportedCountry = "BR") => {
  const fw = getFramework(country);
  const levelDesc = getLevelDesc(level, country);
  const lawsSection = buildLawsSection(legalContext, country);

  const jsonInstruction = `Use EXACTLY these JSON field names (they are programmatic keys, not user-visible):
{
  "abusividade": <number 0-10, 0 = totally fair, 10 = extremely abusive>,
  "resumo": "...",
  "clausulas_abusivas": [
    {
      "texto_original": "...",
      "explicacao_simples": "...",
      "base_legal": "...",
      "gravidade": "alta | media | baixa"
    }
  ],
  "pontos_positivos": ["..."],
  "recomendacao": "..."
}`;

  if (country === "US") {
    return `${lawsSection}

${fw.languageInstruction}

Simplification level: ${levelDesc}

Analyze the provided terms of service and return a JSON with the following structure:

${jsonInstruction}

Rules:
1. ALWAYS return valid JSON, no additional text
2. Be rigorous: identify clauses that limit consumer rights
3. Consider especially: rights waivers, unfair arbitration clauses, excessive liability limitation, data sharing without clear consent, unilateral term changes
4. The abusividade score should reflect real severity
5. In base_legal, cite specific sections of applicable laws (${fw.consumerProtection.primaryLaw}, ${fw.dataPrivacy.primaryLaw}, etc.)`;
  }

  if (country === "FR") {
    return `${lawsSection}

${fw.languageInstruction}

Niveau de simplification : ${levelDesc}

Analysez les conditions d'utilisation fournies et retournez un JSON avec la structure suivante :

${jsonInstruction}

Règles :
1. TOUJOURS retourner du JSON valide, sans texte supplémentaire
2. Soyez rigoureux : identifiez les clauses qui limitent les droits du consommateur
3. Considérez notamment : renonciation aux droits, clauses de juridiction abusives, limitation excessive de responsabilité, partage de données sans consentement clair, modification unilatérale des conditions
4. Le score abusividade doit refléter la gravité réelle
5. Dans base_legal, citez les articles spécifiques (${fw.consumerProtection.primaryLaw}, ${fw.dataPrivacy.primaryLaw}, etc.)`;
  }

  return `${lawsSection}

${fw.languageInstruction}

Nível de simplificação: ${levelDesc}

Analise os termos de uso/serviço fornecidos e retorne um JSON com a seguinte estrutura:

${jsonInstruction}

Regras:
1. SEMPRE retorne JSON válido, sem texto adicional
2. Seja rigoroso na análise: identifique cláusulas que limitam direitos do consumidor
3. Considere especialmente: renúncia de direitos, foro de eleição abusivo, limitação de responsabilidade excessiva, compartilhamento de dados sem consentimento claro, alteração unilateral de termos
4. A nota de abusividade deve refletir a gravidade real: empresas que respeitam o consumidor devem receber notas baixas
5. No campo base_legal, cite artigos específicos das leis identificadas como aplicáveis`;
};

export const TOS_ANALYSIS_USER_PROMPT = (documentData: string, country: SupportedCountry = "BR") => {
  if (country === "US") return `Analyze the following terms of service:\n\n${documentData}`;
  if (country === "FR") return `Analysez les conditions d'utilisation suivantes :\n\n${documentData}`;
  return `Analise os seguintes termos de uso/serviço:\n\n${documentData}`;
};
