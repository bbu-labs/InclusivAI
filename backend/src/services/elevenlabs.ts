const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "UZ8QqWVrz7tMdxiglcLh";
const MODEL_ID = "eleven_multilingual_v2";
const MAX_CHARS = 5000;
const TIMEOUT_MS = 60000;

export async function generateSpeech(
  text: string,
  apiKey: string
): Promise<ArrayBuffer> {
  // Truncate to max characters
  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${DEFAULT_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: truncated,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
    }

    return await response.arrayBuffer();
  } finally {
    clearTimeout(timeoutId);
  }
}
