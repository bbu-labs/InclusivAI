const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVENLABS_STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const STT_TIMEOUT_MS = 120_000;
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

export async function transcribeAudio(
  audioBuffer: ArrayBuffer,
  fileName: string,
  apiKey: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STT_TIMEOUT_MS);

  try {
    const formData = new FormData();
    formData.append("file", new File([audioBuffer], fileName, { type: "audio/webm" }));
    formData.append("model_id", "scribe_v1");
    formData.append("language_code", "pt");

    const response = await fetch(ELEVENLABS_STT_URL, {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`ElevenLabs STT error (${response.status}): ${errorText}`);
    }

    const result = await response.json() as { text: string };
    return result.text;
  } finally {
    clearTimeout(timeoutId);
  }
}
