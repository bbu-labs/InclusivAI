export type RateLimitResult = {
  allowed: boolean;
  current: number;
  limit: number;
  resetAt: number;
};

/**
 * KV-based rate limiter.
 * Key format: rl:{userId}:{resource}:{period}
 */
export async function checkRateLimit(
  kv: KVNamespace,
  userId: string,
  resource: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const period = Math.floor(now / windowMs);
  const key = `rl:${userId}:${resource}:${period}`;

  const raw = await kv.get(key);
  const current = raw ? parseInt(raw, 10) : 0;

  if (current >= maxRequests) {
    return {
      allowed: false,
      current,
      limit: maxRequests,
      resetAt: (period + 1) * windowMs,
    };
  }

  // Increment counter with TTL matching the window
  const ttlSeconds = Math.ceil(windowMs / 1000);
  await kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });

  return {
    allowed: true,
    current: current + 1,
    limit: maxRequests,
    resetAt: (period + 1) * windowMs,
  };
}

// Predefined resource limits
export const RATE_LIMITS = {
  analyses: { maxRequests: 10, windowMs: 30 * 24 * 60 * 60 * 1000 }, // 10/month
  audio: { maxRequests: 5, windowMs: 30 * 24 * 60 * 60 * 1000 }, // 5/month
  questions: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5/day per doc
  doc_gen: { maxRequests: 3, windowMs: 30 * 24 * 60 * 60 * 1000 }, // 3/month
} as const;

export function rateLimitResponse(result: RateLimitResult, resource: string) {
  const resetDate = new Date(result.resetAt);
  const messages: Record<string, string> = {
    analyses: `Você atingiu o limite de ${result.limit} análises. Tente novamente após ${resetDate.toLocaleDateString("pt-BR")}.`,
    audio: `Você atingiu o limite de ${result.limit} gerações de áudio. Tente novamente após ${resetDate.toLocaleDateString("pt-BR")}.`,
    questions: `Você atingiu o limite de ${result.limit} perguntas por dia. Tente novamente amanhã.`,
    doc_gen: `Você atingiu o limite de ${result.limit} documentos gerados. Tente novamente após ${resetDate.toLocaleDateString("pt-BR")}.`,
  };

  return {
    error: "Limite de uso atingido",
    detail: messages[resource] || `Limite de ${result.limit} requisições atingido.`,
    suggestion: "Faça upgrade para o plano premium para limites maiores.",
    current: result.current,
    limit: result.limit,
  };
}
