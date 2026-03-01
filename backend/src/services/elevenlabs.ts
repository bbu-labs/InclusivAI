import type { SupportedLanguage } from "../types";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVENLABS_STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const STT_TIMEOUT_MS = 120_000;
const MODEL_ID = "eleven_multilingual_v2";
const MAX_CHARS = 5000;
const TIMEOUT_MS = 60000;

// Voice IDs per language
const VOICE_IDS: Record<string, string> = {
  "pt-BR": "UZ8QqWVrz7tMdxiglcLh",
  "en-US": "EXAVITQu4vr4xnSDxMaL", // "Sarah" - natural English voice
  "fr-FR": "XB0fDUnXU5powFXDhCwa", // "Charlotte" - natural French voice
};

const DEFAULT_VOICE_ID = "UZ8QqWVrz7tMdxiglcLh";

// STT language codes
const STT_LANGUAGE_CODES: Record<string, string> = {
  "pt-BR": "pt",
  "en-US": "en",
  "fr-FR": "fr",
};

export async function generateSpeech(
  text: string,
  apiKey: string,
  language?: SupportedLanguage
): Promise<ArrayBuffer> {
  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
  const voiceId = (language && VOICE_IDS[language]) || DEFAULT_VOICE_ID;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
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
  apiKey: string,
  language?: SupportedLanguage
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STT_TIMEOUT_MS);
  const langCode = (language && STT_LANGUAGE_CODES[language]) || "pt";

  try {
    const formData = new FormData();
    formData.append("file", new File([audioBuffer], fileName, { type: "audio/webm" }));
    formData.append("model_id", "scribe_v1");
    formData.append("language_code", langCode);

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
