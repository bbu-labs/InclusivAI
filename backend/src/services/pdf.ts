export type PdfExtractionResult = {
  text: string;
  numPages: number;
  needsOcr: boolean;
};

/**
 * Basic PDF text extraction for Cloudflare Workers.
 * Extracts text between stream/endstream markers and decodes basic content.
 * For complex PDFs, falls back to OCR via Pixtral.
 */
export async function extractTextFromPdf(
  pdfBytes: ArrayBuffer
): Promise<PdfExtractionResult> {
  const bytes = new Uint8Array(pdfBytes);
  const raw = new TextDecoder("latin1").decode(bytes);

  // Count pages
  const pageCount = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;

  // Extract text from content streams — look for text between BT/ET operators
  const textChunks: string[] = [];
  const tjRegex = /\(([^)]*)\)\s*Tj/g;
  const tdRegex = /\[((?:\([^)]*\)\s*[-\d.]*\s*)*)\]\s*TJ/gi;

  let match;
  while ((match = tjRegex.exec(raw)) !== null) {
    textChunks.push(decodePdfString(match[1]));
  }
  while ((match = tdRegex.exec(raw)) !== null) {
    const inner = match[1];
    const parts = inner.match(/\(([^)]*)\)/g);
    if (parts) {
      textChunks.push(parts.map((p) => decodePdfString(p.slice(1, -1))).join(""));
    }
  }

  const text = textChunks.join(" ").replace(/\s+/g, " ").trim();
  const needsOcr = text.length < 50;

  return { text, numPages: pageCount || 1, needsOcr };
}

function decodePdfString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\")
    .replace(/\\([()])/g, "$1");
}
