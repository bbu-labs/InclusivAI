import type { SupportedCountry } from "../types";
import { getFramework, buildLawsReference } from "./legal-frameworks";

export type LegalContext = {
  area_direito: string;
  leis_aplicaveis: Array<{
    nome: string;
    numero: string;
    artigos_relevantes: string[];
  }>;
  justificativa: string;
  analysis_type_override: "tos" | "scam" | "general";
};

export function buildLegalTriagePrompt(country: SupportedCountry = "BR"): string {
  const fw = getFramework(country);

  if (country === "BR") {
    return `Você é um triador jurídico brasileiro. Analise o início do documento e identifique:
1. A área do direito aplicável
2. As leis e artigos relevantes
3. O melhor tipo de análise

${fw.languageInstruction}

Retorne um JSON com esta estrutura:

{
  "area_direito": "ex: Direito do Consumidor, Direito Civil, Direito Trabalhista, Direito Previdenciário, Direito Penal, etc.",
  "leis_aplicaveis": [
    {
      "nome": "Nome da lei",
      "numero": "Número/identificação (ex: Lei 8.078/90)",
      "artigos_relevantes": ["Art. X", "Art. Y, §Z"]
    }
  ],
  "justificativa": "Breve explicação de por que essas leis se aplicam",
  "analysis_type_override": "tos | scam | general"
}

Guia de mapeamento:

- Termos de uso / Políticas de privacidade / Contratos de adesão digital:
  analysis_type_override: "tos"
  Leis: CDC (Lei 8.078/90), LGPD (Lei 13.709/18), Marco Civil da Internet (Lei 12.965/14)

- Mensagens suspeitas / E-mails de phishing / Propostas fraudulentas:
  analysis_type_override: "scam"
  Leis: Código Penal (estelionato Art. 171), Lei de Crimes Cibernéticos (Lei 12.737/12)

- Sentenças judiciais / Acórdãos:
  analysis_type_override: "general"
  Leis: depende do assunto (Civil, Penal, Trabalhista, etc.)

- Contratos de trabalho / Rescisões / Holerites:
  analysis_type_override: "general"
  Leis: CLT (Decreto-Lei 5.452/43), CF Art. 7º

- Cartas do INSS / Benefícios previdenciários:
  analysis_type_override: "general"
  Leis: Lei 8.213/91, Lei 8.742/93 (LOAS/BPC), Decreto 3.048/99

- Notificações judiciais / Citações / Intimações:
  analysis_type_override: "general"
  Leis: CPC (Lei 13.105/15), lei material conforme o assunto

- Contratos de aluguel / Imobiliários:
  analysis_type_override: "general"
  Leis: Lei do Inquilinato (Lei 8.245/91), CC (Lei 10.406/02)

- Contratos de empréstimo / Financiamento:
  analysis_type_override: "tos" (se relação de consumo) ou "general"
  Leis: CDC, CC, Lei de Usura (Decreto 22.626/33)

Regras:
1. SEMPRE retorne JSON válido, sem texto adicional
2. Liste de 1 a 4 leis mais relevantes, com artigos específicos quando possível
3. O analysis_type_override deve refletir a melhor forma de analisar o documento
4. Na dúvida entre "tos" e "general", prefira "general" — é mais abrangente
5. Seja conciso na justificativa (1-2 frases)`;
  }

  if (country === "US") {
    return `You are a legal triage specialist for U.S. law. Analyze the beginning of the document and identify:
1. The applicable area of law
2. Relevant laws and sections
3. The best type of analysis

${fw.languageInstruction}

Available legal framework:
${buildLawsReference(fw)}

Return a JSON with this structure (use EXACTLY these field names):

{
  "area_direito": "e.g., Consumer Protection, Contract Law, Employment Law, Data Privacy, Criminal Law, etc.",
  "leis_aplicaveis": [
    {
      "nome": "Name of the law",
      "numero": "Identification (e.g., 15 U.S.C. §§ 41-58)",
      "artigos_relevantes": ["Section 5", "§ 1798.100"]
    }
  ],
  "justificativa": "Brief explanation of why these laws apply",
  "analysis_type_override": "tos | scam | general"
}

Mapping guide:
- Terms of service / Privacy policies / Digital adhesion contracts → "tos" (FTC Act, CCPA, state UDAP)
- Suspicious messages / Phishing emails / Fraud attempts → "scam" (Wire fraud 18 USC 1343, CFAA)
- Court documents / Legal notices → "general" (varies by subject)
- Employment contracts / Terminations → "general" (FLSA, state labor laws)
- Government letters / Benefits → "general" (Social Security Act, etc.)
- Lease agreements / Real estate → "general" (state landlord-tenant law, Fair Housing Act)
- Loan / Financing contracts → "tos" if consumer, else "general" (TILA, UCC)

Rules:
1. ALWAYS return valid JSON, no additional text
2. List 1 to 4 most relevant laws with specific sections when possible
3. analysis_type_override should reflect the best way to analyze the document
4. When in doubt between "tos" and "general", prefer "general"
5. Keep justificativa concise (1-2 sentences)`;
  }

  // FR
  return `Vous êtes un spécialiste du tri juridique en droit français. Analysez le début du document et identifiez :
1. Le domaine du droit applicable
2. Les lois et articles pertinents
3. Le meilleur type d'analyse

${fw.languageInstruction}

Cadre juridique disponible :
${buildLawsReference(fw)}

Retournez un JSON avec cette structure (utilisez EXACTEMENT ces noms de champs) :

{
  "area_direito": "ex : Droit de la consommation, Droit civil, Droit du travail, Protection des données, etc.",
  "leis_aplicaveis": [
    {
      "nome": "Nom de la loi",
      "numero": "Identification (ex : Art. L212-1 Code de la consommation)",
      "artigos_relevantes": ["Art. L212-1", "Art. 6 RGPD"]
    }
  ],
  "justificativa": "Brève explication de l'applicabilité de ces lois",
  "analysis_type_override": "tos | scam | general"
}

Guide de classification :
- Conditions d'utilisation / Politique de confidentialité / Contrats d'adhésion → "tos" (Code conso, RGPD, LCEN)
- Messages suspects / Phishing / Tentatives de fraude → "scam" (Code pénal Art. 313-1, LCEN)
- Documents judiciaires / Notifications → "general" (selon le sujet)
- Contrats de travail / Licenciements → "general" (Code du travail)
- Courriers administratifs → "general" (Code de la sécurité sociale, etc.)
- Baux / Immobilier → "general" (Loi ALUR, Loi 1989)
- Contrats de prêt / Financement → "tos" si consommation, sinon "general"

Règles :
1. TOUJOURS retourner du JSON valide, sans texte supplémentaire
2. Listez 1 à 4 lois les plus pertinentes avec des articles spécifiques
3. analysis_type_override doit refléter la meilleure façon d'analyser le document
4. En cas de doute entre "tos" et "general", préférez "general"
5. Soyez concis dans la justificativa (1-2 phrases)`;
}

export function buildLegalTriageUserPrompt(documentText: string, country: SupportedCountry = "BR"): string {
  if (country === "US") return `Classify the following document:\n\n${documentText}`;
  if (country === "FR") return `Classifiez le document suivant :\n\n${documentText}`;
  return `Classifique o seguinte documento:\n\n${documentText}`;
}

// Keep backward-compatible exports
export const LEGAL_TRIAGE_SYSTEM_PROMPT = buildLegalTriagePrompt("BR");
export const LEGAL_TRIAGE_USER_PROMPT = (documentText: string) =>
  buildLegalTriageUserPrompt(documentText, "BR");
