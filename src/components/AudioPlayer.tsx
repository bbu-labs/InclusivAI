"use client";

import { useState, useRef } from "react";
import { apiGenerateAudio, ApiError } from "@/lib/api";
import { IoVolumeHigh, IoPlay, IoPause } from "react-icons/io5";

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function AudioPlayer({ analysisId, initialUrl }: { analysisId: string; initialUrl?: string | null }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(initialUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { audio } = await apiGenerateAudio(analysisId);
      setAudioUrl(audio.audioUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao gerar áudio");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) {
      audioRef.current.playbackRate = next;
    }
  };

  if (!audioUrl) {
    return (
      <div>
        <button
          className="btn btn-outline btn-sm gap-2"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <IoVolumeHigh />
          )}
          Gerar Áudio
        </button>
        {error && <p className="text-xs text-error mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-base-200 rounded-xl p-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <button className="btn btn-circle btn-sm btn-primary" onClick={togglePlay}>
        {isPlaying ? <IoPause /> : <IoPlay />}
      </button>
      <div className="flex-1">
        <p className="text-xs text-base-content/60">Áudio da análise</p>
      </div>
      <button
        className="btn btn-ghost btn-xs"
        onClick={changeSpeed}
      >
        {speed}x
      </button>
    </div>
  );
}
