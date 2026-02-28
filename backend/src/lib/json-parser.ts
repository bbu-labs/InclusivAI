/**
 * Parse JSON from LLM output, handling common issues like
 * markdown code fences and leading/trailing text.
 */
export function parseJSON<T = unknown>(raw: string): T {
  // 1. Try direct parse first
  try {
    return JSON.parse(raw) as T;
  } catch {
    // continue to cleanup
  }

  // 2. Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T;
    } catch {
      // continue to fallback
    }
  }

  // 3. Find first { to last } (or first [ to last ])
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  const firstBracket = raw.indexOf("[");
  const lastBracket = raw.lastIndexOf("]");

  // Try object extraction
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(raw.slice(firstBrace, lastBrace + 1)) as T;
    } catch {
      // continue
    }
  }

  // Try array extraction
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(raw.slice(firstBracket, lastBracket + 1)) as T;
    } catch {
      // continue
    }
  }

  throw new Error(
    `Failed to parse JSON from LLM response. Raw output starts with: "${raw.slice(0, 120)}..."`
  );
}
