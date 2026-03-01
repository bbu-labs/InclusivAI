const MAX_CONTENT_BYTES = 50 * 1024; // 50KB limit
const FETCH_TIMEOUT_MS = 10_000;

export type UrlFetchResult =
  | { ok: true; text: string; url: string }
  | { ok: false; error: string };

export function isUrl(input: string): boolean {
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) && !trimmed.includes("\n");
}

export async function fetchUrlContent(rawUrl: string): Promise<UrlFetchResult> {
  const url = rawUrl.trim();

  try {
    new URL(url);
  } catch {
    return { ok: false, error: "URL inválida" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InclusivAI/1.0)",
        Accept: "text/html, text/plain, */*",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain") &&
      !contentType.includes("application/xhtml")
    ) {
      return { ok: false, error: "Tipo de conteúdo não suportado" };
    }

    const rawHtml = await response.text();
    const truncated = rawHtml.slice(0, MAX_CONTENT_BYTES);
    const text = extractTextFromHtml(truncated);

    if (text.length < 20) {
      return { ok: false, error: "Conteúdo insuficiente na página" };
    }

    return { ok: true, text, url: response.url };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Timeout ao acessar URL" };
    }
    return { ok: false, error: "Erro ao acessar URL" };
  }
}

function extractTextFromHtml(html: string): string {
  let text = html;

  // Remove scripts, styles, and other non-content tags
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");

  // Replace block-level tags with newlines
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|br|section|article)>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n\s*\n/g, "\n\n");
  text = text.trim();

  return text;
}
