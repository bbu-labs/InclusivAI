const INTER_400_URL =
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff";
const INTER_700_URL =
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff";

const FONT_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

async function fetchWithKVCache(
  url: string,
  cacheKey: string,
  kv: KVNamespace
): Promise<ArrayBuffer> {
  // Try KV cache first
  const cached = await kv.get(cacheKey, "arrayBuffer");
  if (cached) return cached;

  // Fetch from CDN
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${url} (${res.status})`);
  }
  const buffer = await res.arrayBuffer();

  // Cache in KV (non-blocking)
  kv.put(cacheKey, buffer, { expirationTtl: FONT_CACHE_TTL });

  return buffer;
}

export async function loadFonts(kv: KVNamespace) {
  const [inter400, inter700] = await Promise.all([
    fetchWithKVCache(INTER_400_URL, "font:inter-400", kv),
    fetchWithKVCache(INTER_700_URL, "font:inter-700", kv),
  ]);

  return [
    { name: "Inter", data: inter400, weight: 400 as const },
    { name: "Inter", data: inter700, weight: 700 as const },
  ];
}
