import type { SupabaseClient } from "@supabase/supabase-js";
import { generateSpeech } from "../services/elevenlabs";

// Estimate audio duration: ~150 words per minute, ~5 chars per word in Portuguese
function estimateDuration(text: string): number {
  const words = text.length / 5;
  return Math.ceil((words / 150) * 60);
}

async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type AudioResult = {
  audioUrl: string;
  durationSec: number;
};

export async function generateAudio(
  summaryText: string,
  analysisId: string,
  supabaseAdmin: SupabaseClient,
  kvCache: KVNamespace | undefined,
  elevenLabsKey: string
): Promise<AudioResult> {
  const hash = await hashText(summaryText);
  const cacheKey = `audio:${analysisId}:${hash}`;

  // Check KV cache
  if (kvCache) {
    const cached = await kvCache.get(cacheKey, "json");
    if (cached) {
      return cached as AudioResult;
    }
  }

  // Generate speech
  const audioBytes = await generateSpeech(summaryText, elevenLabsKey);

  // Upload to Supabase Storage
  const filePath = `audio/${analysisId}/${hash}.mp3`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("audio")
    .upload(filePath, audioBytes, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload audio: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from("audio")
    .getPublicUrl(filePath);

  const result: AudioResult = {
    audioUrl: urlData.publicUrl,
    durationSec: estimateDuration(summaryText),
  };

  // Cache in KV (expire in 30 days)
  if (kvCache) {
    await kvCache.put(cacheKey, JSON.stringify(result), {
      expirationTtl: 60 * 60 * 24 * 30,
    });
  }

  return result;
}
