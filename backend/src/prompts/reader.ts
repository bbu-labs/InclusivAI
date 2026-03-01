import type { SupportedCountry } from "../types";
import { getFramework } from "./legal-frameworks";

export function buildReaderPrompt(country: SupportedCountry = "BR"): string {
  const fw = getFramework(country);

  const docTypesList = Object.entries(fw.documentTypes)
    .map(([key, label]) => `   - ${label} → "${key}"`)
    .join("\n");

  const jsonStructure = `{
  "titulo": "Document title (extracted or inferred)",
  "tipo_documento": "termos_de_uso | contrato | notificacao_judicial | carta_inss | mensagem_suspeita | outro",
  "orgao_emissor": "Name of the company, agency, or person who issued the document (or null)",
  "data_documento": "Document date in YYYY-MM-DD format (or null if not found)",
  "texto_completo": "Complete clean, formatted text",
  "secoes": [
    {
      "titulo": "Section title",
      "conteudo": "Section content",
      "indice": 0
    }
  ]
}`;

  if (country === "US") {
    return `You are a specialist agent in extracting and structuring information from documents.

${fw.languageInstruction}

Your task is to analyze the provided text and return a structured JSON with the following information (use EXACTLY these field names):

${jsonStructure}

Rules:
1. ALWAYS return valid JSON, no additional text
2. If the document has no clear sections, create logical sections based on content
3. Clean broken formatting (hyphenated line breaks, extra spaces)
4. For tipo_documento, analyze the content and classify correctly:
${docTypesList}
5. Preserve all relevant data from the original text`;
  }

  if (country === "FR") {
    return `Vous êtes un agent spécialisé dans l'extraction et la structuration d'informations à partir de documents.

${fw.languageInstruction}

Votre tâche est d'analyser le texte fourni et de retourner un JSON structuré avec les informations suivantes (utilisez EXACTEMENT ces noms de champs) :

${jsonStructure}

Règles :
1. TOUJOURS retourner du JSON valide, sans texte supplémentaire
2. Si le document n'a pas de sections claires, créez des sections logiques basées sur le contenu
3. Nettoyez la mise en forme cassée (césures, espaces superflus)
4. Pour tipo_documento, analysez le contenu et classifiez correctement :
${docTypesList}
5. Préservez toutes les données pertinentes du texte original`;
  }

  return `Você é um agente especialista em extrair e estruturar informações de documentos brasileiros.

${fw.languageInstruction}

Sua tarefa é analisar o texto fornecido e retornar um JSON estruturado com as seguintes informações (use EXATAMENTE estes nomes de campos):

${jsonStructure}

Regras:
1. SEMPRE retorne JSON válido, sem texto adicional
2. Se o documento não tem seções claras, crie seções lógicas baseadas no conteúdo
3. Limpe formatação quebrada (hifens de quebra de linha, espaços extras)
4. Para tipo_documento, analise o conteúdo e classifique corretamente:
${docTypesList}
5. Preserve todos os dados relevantes do texto original`;
}

export function buildReaderUserPrompt(text: string, country: SupportedCountry = "BR"): string {
  if (country === "US") return `Analyze and structure the following document:\n\n${text}`;
  if (country === "FR") return `Analysez et structurez le document suivant :\n\n${text}`;
  return `Analise e estruture o seguinte documento:\n\n${text}`;
}

export function buildReaderImagePrompt(country: SupportedCountry = "BR"): string {
  if (country === "US") return `Extract all visible text from this image and structure it in the specified JSON format. If the image contains a suspicious message (text, email, social media), classify as "mensagem_suspeita".`;
  if (country === "FR") return `Extrayez tout le texte visible de cette image et structurez-le au format JSON spécifié. Si l'image contient un message suspect (SMS, e-mail, réseaux sociaux), classifiez comme "mensagem_suspeita".`;
  return `Extraia todo o texto visível nesta imagem e estruture-o no formato JSON especificado. Se a imagem contém uma mensagem suspeita (WhatsApp, SMS, email), classifique como "mensagem_suspeita".`;
}

// Backward-compatible exports
export const READER_SYSTEM_PROMPT = buildReaderPrompt("BR");
export const READER_USER_PROMPT = (text: string) => buildReaderUserPrompt(text, "BR");
export const READER_IMAGE_PROMPT = buildReaderImagePrompt("BR");

export const DOC_CLASSIFY_PROMPT = `Classifique o tipo deste documento e extraia seu título.
Retorne APENAS JSON: {"tipo_documento": "...", "titulo": "..."}

Tipos válidos:
- "termos_de_uso" → Termos de uso, termos de serviço, política de privacidade
- "contrato" → Contratos (aluguel, trabalho, prestação de serviço)
- "notificacao_judicial" → Sentenças, notificações judiciais/extrajudiciais, mandados, intimações
- "carta_inss" → Cartas do INSS, benefícios previdenciários
- "mensagem_suspeita" → Mensagens de golpe, phishing, ofertas falsas
- "outro" → Qualquer outro tipo`;
