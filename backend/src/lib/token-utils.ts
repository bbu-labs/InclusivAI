/**
 * Estimate token count for Portuguese text.
 * Approximation: ~4 characters per token for Portuguese.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to approximate token limit, preserving word boundaries.
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;

  if (text.length <= maxChars) {
    return text;
  }

  // Cut at maxChars then find last space to preserve word boundary
  const truncated = text.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxChars * 0.8) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}
