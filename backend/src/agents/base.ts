export type AgentResult<T = unknown> = {
  success: boolean;
  data: T | null;
  error: string | null;
  tokensInput: number;
  tokensOutput: number;
  modelUsed: string;
  durationMs: number;
};

/**
 * Wraps an agent function with timing and error handling.
 */
export async function runAgent<T>(
  modelUsed: string,
  fn: () => Promise<{ data: T; tokensInput: number; tokensOutput: number }>
): Promise<AgentResult<T>> {
  const start = Date.now();

  try {
    const { data, tokensInput, tokensOutput } = await fn();
    return {
      success: true,
      data,
      error: null,
      tokensInput,
      tokensOutput,
      modelUsed,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
      tokensInput: 0,
      tokensOutput: 0,
      modelUsed,
      durationMs: Date.now() - start,
    };
  }
}
