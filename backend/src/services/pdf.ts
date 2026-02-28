import { PDFParse } from "pdf-parse";

export type PdfExtractionResult = {
  text: string;
  numPages: number;
  needsOcr: boolean;
};

/**
 * Extract text from a PDF buffer.
 * If text is empty/very short (scanned PDF), flags for OCR fallback.
 */
export async function extractTextFromPdf(
  pdfBytes: ArrayBuffer
): Promise<PdfExtractionResult> {
  const parser = new PDFParse({ data: new Uint8Array(pdfBytes) });

  try {
    const info = await parser.getInfo();
    const textResult = await parser.getText();

    const text = textResult.text.trim();
    const needsOcr = text.length < 50;

    return {
      text,
      numPages: info.total,
      needsOcr,
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
}
