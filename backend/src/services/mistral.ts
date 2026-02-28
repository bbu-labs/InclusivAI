import { Mistral } from "@mistralai/mistralai";
import { parseJSON } from "../lib/json-parser";

export const MINISTRAL_8B = "ministral-8b-latest";
export const MISTRAL_LARGE = "mistral-large-latest";
export const PIXTRAL = "pixtral-large-latest";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type MistralClient = {
  chatJSON: <T = unknown>(
    model: string,
    messages: ChatMessage[],
    maxTokens?: number
  ) => Promise<{ data: T; tokensInput: number; tokensOutput: number }>;
  chatVision: <T = unknown>(
    model: string,
    systemPrompt: string,
    imageBase64: string,
    mimeType: string,
    userPrompt: string,
    maxTokens?: number
  ) => Promise<{ data: T; tokensInput: number; tokensOutput: number }>;
};

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status =
        err instanceof Error && "statusCode" in err
          ? (err as { statusCode: number }).statusCode
          : 0;

      if (attempt < MAX_RETRIES - 1 && (isRetryable(status) || status === 0)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

export function createMistralClient(apiKey: string): MistralClient {
  const client = new Mistral({ apiKey });

  return {
    async chatJSON<T = unknown>(
      model: string,
      messages: ChatMessage[],
      maxTokens = 4096
    ) {
      const result = await withRetry(() =>
        client.chat.complete({
          model,
          messages,
          maxTokens,
          responseFormat: { type: "json_object" },
        })
      );

      const content = result.choices?.[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new Error("Empty response from Mistral API");
      }

      const data = parseJSON<T>(content);
      return {
        data,
        tokensInput: result.usage?.promptTokens ?? 0,
        tokensOutput: result.usage?.completionTokens ?? 0,
      };
    },

    async chatVision<T = unknown>(
      model: string,
      systemPrompt: string,
      imageBase64: string,
      mimeType: string,
      userPrompt: string,
      maxTokens = 4096
    ) {
      const result = await withRetry(() =>
        client.chat.complete({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  imageUrl: `data:${mimeType};base64,${imageBase64}`,
                },
                { type: "text", text: userPrompt },
              ],
            },
          ],
          maxTokens,
          responseFormat: { type: "json_object" },
        })
      );

      const content = result.choices?.[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new Error("Empty response from Mistral API");
      }

      const data = parseJSON<T>(content);
      return {
        data,
        tokensInput: result.usage?.promptTokens ?? 0,
        tokensOutput: result.usage?.completionTokens ?? 0,
      };
    },
  };
}
