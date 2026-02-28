import { runAgent, type AgentResult } from "./base";
import { READER_SYSTEM_PROMPT, READER_USER_PROMPT, READER_IMAGE_PROMPT } from "../prompts/reader";
import { MINISTRAL_8B, PIXTRAL, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";
import { extractTextFromPdf } from "../services/pdf";

const INPUT_TOKEN_LIMIT = 32000;
const OUTPUT_TOKEN_LIMIT = 4096;

export type StructuredDocument = {
  titulo: string;
  tipo_documento: string;
  orgao_emissor: string | null;
  data_documento: string | null;
  texto_completo: string;
  secoes: Array<{
    titulo: string;
    conteudo: string;
    indice: number;
  }>;
};

export function readFromText(
  rawText: string,
  mistralClient: MistralClient
): Promise<AgentResult<StructuredDocument>> {
  const truncated = truncateToTokens(rawText, INPUT_TOKEN_LIMIT);

  return runAgent<StructuredDocument>(MINISTRAL_8B, () =>
    mistralClient.chatJSON<StructuredDocument>(
      MINISTRAL_8B,
      [
        { role: "system", content: READER_SYSTEM_PROMPT },
        { role: "user", content: READER_USER_PROMPT(truncated) },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}

export async function readFromPdf(
  pdfBytes: ArrayBuffer,
  mistralClient: MistralClient
): Promise<AgentResult<StructuredDocument>> {
  const { text, needsOcr } = await extractTextFromPdf(pdfBytes);

  if (needsOcr) {
    // Scanned PDF — convert first page to image would need a separate service
    // For now, return error suggesting image upload instead
    return {
      success: false,
      data: null,
      error: "PDF escaneado detectado. Por favor, envie como imagem para OCR.",
      tokensInput: 0,
      tokensOutput: 0,
      modelUsed: MINISTRAL_8B,
      durationMs: 0,
    };
  }

  return readFromText(text, mistralClient);
}

export function readFromImage(
  imageBase64: string,
  mimeType: string,
  mistralClient: MistralClient
): Promise<AgentResult<StructuredDocument>> {
  return runAgent<StructuredDocument>(PIXTRAL, () =>
    mistralClient.chatVision<StructuredDocument>(
      PIXTRAL,
      READER_SYSTEM_PROMPT,
      imageBase64,
      mimeType,
      READER_IMAGE_PROMPT,
      OUTPUT_TOKEN_LIMIT
    )
  );
}
