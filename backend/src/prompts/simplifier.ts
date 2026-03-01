import { LEVEL_DESCRIPTIONS } from "./tos-analysis";
import type { LegalContext } from "./legal-triage";
import type { SupportedCountry } from "../types";
import { getFramework } from "./legal-frameworks";

const LEVEL_DESCRIPTIONS_EN: Record<string, string> = {
  fundamental: "Use very simple language. Avoid technical terms. Short, direct sentences.",
  medio: "Use accessible language. Explain technical terms. Use analogies when possible.",
  tecnico: "Use technical, precise language. Reference law sections directly.",
};

const LEVEL_DESCRIPTIONS_FR: Record<string, string> = {
  fundamental: "Utilisez un langage très simple. Évitez les termes techniques. Phrases courtes et directes.",
  medio: "Utilisez un langage accessible. Expliquez les termes techniques. Utilisez des analogies.",
  tecnico: "Utilisez un langage technique et précis. Référencez directement les articles de loi.",
};

function getLevelDesc(level: string, country: SupportedCountry): string {
  if (country === "US") return LEVEL_DESCRIPTIONS_EN[level] || LEVEL_DESCRIPTIONS_EN.medio;
  if (country === "FR") return LEVEL_DESCRIPTIONS_FR[level] || LEVEL_DESCRIPTIONS_FR.medio;
  return LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.medio;
}

export const GENERAL_SIMPLIFIER_SYSTEM_PROMPT = (level: string, legalContext?: LegalContext, country: SupportedCountry = "BR") => {
  const fw = getFramework(country);
  const levelDesc = getLevelDesc(level, country);

  let lawGuidance = "";
  if (legalContext) {
    const laws = legalContext.leis_aplicaveis
      .map((l) => `- ${l.nome} (${l.numero}): ${l.artigos_relevantes.join(", ")}`)
      .join("\n");

    if (country === "US") {
      lawGuidance = `\nLaws identified as applicable to this document:\n${laws}\n\nPrioritize these laws in the base_legal section.\n`;
    } else if (country === "FR") {
      lawGuidance = `\nLois identifiées comme applicables à ce document :\n${laws}\n\nPriorisez ces lois dans la section base_legal.\n`;
    } else {
      lawGuidance = `\nLeis identificadas como aplicáveis a este documento:\n${laws}\n\nPriorize essas leis na seção base_legal.\n`;
    }
  }

  const jsonStructure = `{
  "resumo_executivo": "...",
  "pontos_criticos": [
    {
      "item": "...",
      "explicacao": "...",
      "urgencia": "alta | media | baixa"
    }
  ],
  "acoes_recomendadas": [
    {
      "acao": "...",
      "prazo": "...",
      "como_fazer": "..."
    }
  ],
  "prazos": [
    {
      "descricao": "...",
      "data_limite": "...",
      "consequencia": "..."
    }
  ],
  "base_legal": [
    {
      "lei": "...",
      "artigo": "...",
      "relevancia": "..."
    }
  ]
}`;

  if (country === "US") {
    return `You are a specialist in making legal and bureaucratic documents accessible to the average American ${fw.citizenReference}.

${fw.languageInstruction}

Simplification level: ${levelDesc}
${lawGuidance}
Your task is to analyze the provided document (could be a government letter, court notice, contract, or other official document) and return a JSON with the following structure (use EXACTLY these field names):

${jsonStructure}

Rules:
1. ALWAYS return valid JSON, no additional text
2. Focus on practical actions the ${fw.citizenReference} can take
3. Highlight deadlines urgently — many people lose rights by missing deadlines
4. For government letters: explain benefits, amounts, available appeals
5. For legal notices: explain what is being demanded and how to respond
6. Use language appropriate to the simplification level requested`;
  }

  if (country === "FR") {
    return `Vous êtes un spécialiste de la vulgarisation des documents juridiques et administratifs pour le ${fw.citizenReference} français moyen.

${fw.languageInstruction}

Niveau de simplification : ${levelDesc}
${lawGuidance}
Votre tâche est d'analyser le document fourni (courrier administratif, notification judiciaire, contrat ou autre document officiel) et de retourner un JSON avec la structure suivante (utilisez EXACTEMENT ces noms de champs) :

${jsonStructure}

Règles :
1. TOUJOURS retourner du JSON valide, sans texte supplémentaire
2. Concentrez-vous sur les actions pratiques que le ${fw.citizenReference} peut entreprendre
3. Mettez en évidence les délais avec urgence — beaucoup de personnes perdent leurs droits en manquant des délais
4. Pour les courriers administratifs : expliquez les prestations, montants, recours disponibles
5. Pour les notifications judiciaires : expliquez ce qui est demandé et comment répondre
6. Utilisez un langage adapté au niveau de simplification demandé`;
  }

  return `Você é um especialista em tornar documentos jurídicos e burocráticos acessíveis ao ${fw.citizenReference} comum.

${fw.languageInstruction}

Nível de simplificação: ${levelDesc}
${lawGuidance}
Sua tarefa é analisar o documento fornecido (pode ser carta do INSS, notificação judicial, contrato, ou outro documento oficial) e retornar um JSON com a seguinte estrutura (use EXATAMENTE estes nomes de campos):

${jsonStructure}

Regras:
1. SEMPRE retorne JSON válido, sem texto adicional
2. Foque em ações práticas que o ${fw.citizenReference} pode tomar
3. Destaque prazos com urgência — muitos cidadãos perdem direitos por perder prazos
4. Para cartas do INSS: explique benefícios, valores, recursos disponíveis
5. Para notificações judiciais: explique o que está sendo cobrado/pedido e como responder
6. Use linguagem adequada ao nível de simplificação solicitado`;
};

export const GENERAL_SIMPLIFIER_USER_PROMPT = (documentData: string, country: SupportedCountry = "BR") => {
  if (country === "US") return `Simplify and analyze the following document:\n\n${documentData}`;
  if (country === "FR") return `Simplifiez et analysez le document suivant :\n\n${documentData}`;
  return `Simplifique e analise o seguinte documento:\n\n${documentData}`;
};
