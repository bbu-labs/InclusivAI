"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { apiGenerateAudio, ApiError } from "@/lib/api";
import { useExperience } from "@/contexts/ExperienceContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { IoVolumeHigh, IoPlay, IoPause } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const SPEEDS = [0.75, 1, 1.25, 1.5];

interface AudioPlayerProps {
  analysisId: string;
  initialUrl?: string | null;
  fallbackText?: string;
}

export default function AudioPlayer({ analysisId, initialUrl, fallbackText }: AudioPlayerProps) {
  const { t } = useTranslation();
  const { profile: xp } = useExperience();
  const { language } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(initialUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Browser TTS state
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Auto-generate audio for users who prefer audio
  const autoGenTriggered = useRef(false);
  useEffect(() => {
    if (xp.preferAudio && !audioUrl && !loading && !autoGenTriggered.current) {
      autoGenTriggered.current = true;
      handleGenerate();
    }
  }, [xp.preferAudio, audioUrl, loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setShowFallback(false);
    try {
      const { audio } = await apiGenerateAudio(analysisId);
      setAudioUrl(audio.audioUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setShowFallback(err.fallback || err.status >= 400);
      } else {
        setError(t("audioPlayer.error"));
        setShowFallback(true);
      }
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

  // Browser TTS functions
  const startBrowserTTS = useCallback(() => {
    if (!fallbackText || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fallbackText);
    utterance.lang = language;
    utterance.rate = ttsSpeed;

    // Try to pick a voice matching the user's language
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language.split("-")[0];
    const matchVoice = voices.find((v) => v.lang.startsWith(language)) || voices.find((v) => v.lang.startsWith(langPrefix));
    if (matchVoice) utterance.voice = matchVoice;

    utterance.onstart = () => setTtsSpeaking(true);
    utterance.onend = () => { setTtsSpeaking(false); setTtsActive(false); };
    utterance.onerror = () => { setTtsSpeaking(false); setTtsActive(false); };

    utteranceRef.current = utterance;
    setTtsActive(true);
    window.speechSynthesis.speak(utterance);
  }, [fallbackText, ttsSpeed, language]);

  const toggleTTS = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (ttsSpeaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    } else if (ttsActive) {
      window.speechSynthesis.resume();
    } else {
      startBrowserTTS();
    }
  }, [ttsSpeaking, ttsActive, startBrowserTTS]);

  const stopTTS = useCallback(() => {
    window.speechSynthesis?.cancel();
    setTtsSpeaking(false);
    setTtsActive(false);
  }, []);

  const changeTTSSpeed = () => {
    const idx = SPEEDS.indexOf(ttsSpeed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setTtsSpeed(next);
    // Restart with new speed if currently speaking
    if (ttsActive) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(fallbackText || "");
        utterance.lang = language;
        utterance.rate = next;
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = language.split("-")[0];
        const matchVoice = voices.find((v) => v.lang.startsWith(language)) || voices.find((v) => v.lang.startsWith(langPrefix));
        if (matchVoice) utterance.voice = matchVoice;
        utterance.onstart = () => setTtsSpeaking(true);
        utterance.onend = () => { setTtsSpeaking(false); setTtsActive(false); };
        utterance.onerror = () => { setTtsSpeaking(false); setTtsActive(false); };
        utteranceRef.current = utterance;
        setTtsActive(true);
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  // ─── Browser TTS player (active after fallback button click) ───
  if (ttsActive) {
    return (
      <div className="flex items-center gap-3 bg-base-200 rounded-xl p-3">
        <button
          className="btn btn-circle btn-sm btn-primary"
          onClick={toggleTTS}
          aria-label={ttsSpeaking && !window.speechSynthesis?.paused ? t("audioPlayer.pause") : t("audioPlayer.play")}
        >
          {ttsSpeaking && !window.speechSynthesis?.paused ? <IoPause /> : <IoPlay />}
        </button>
        <div className="flex-1">
          <p className="text-xs text-base-content/60">{t("audioPlayer.browserAudio")}</p>
        </div>
        <button
          className="btn btn-ghost btn-xs"
          onClick={changeTTSSpeed}
          aria-label={t("audioPlayer.speed", { rate: ttsSpeed })}
        >
          {ttsSpeed}x
        </button>
        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={stopTTS}
          aria-label={t("audioPlayer.stopAudio")}
        >
          {t("audioPlayer.stop")}
        </button>
      </div>
    );
  }

  // ─── No audio yet: show generate button (+ fallback on error) ───
  const seniorSize = xp.preferAudio;
  if (!audioUrl) {
    return (
      <div>
        <button
          className={`btn btn-outline gap-2 ${seniorSize ? "btn-lg" : "btn-sm"}`}
          onClick={handleGenerate}
          disabled={loading}
          aria-label={t("audioPlayer.generateAria")}
        >
          {loading ? (
            <span className={`loading loading-spinner ${seniorSize ? "loading-md" : "loading-xs"}`} />
          ) : (
            <IoVolumeHigh className={seniorSize ? "text-xl" : ""} />
          )}
          {t("audioPlayer.generate")}
        </button>
        {error && (
          <div className="mt-2">
            <p className="text-xs text-error">{error}</p>
            {showFallback && fallbackText && (
              <button
                className="btn btn-outline btn-xs gap-1 mt-2"
                onClick={startBrowserTTS}
                aria-label={t("audioPlayer.browserFallback")}
              >
                <IoVolumeHigh className="text-sm" />
                {t("audioPlayer.browserFallback")}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── API audio player ───
  return (
    <div className="flex items-center gap-3 bg-base-200 rounded-xl p-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        className="btn btn-circle btn-sm btn-primary"
        onClick={togglePlay}
        aria-label={isPlaying ? t("audioPlayer.pause") : t("audioPlayer.play")}
      >
        {isPlaying ? <IoPause /> : <IoPlay />}
      </button>
      <div className="flex-1">
        <p className="text-xs text-base-content/60">{t("audioPlayer.apiAudio")}</p>
      </div>
      <button
        className="btn btn-ghost btn-xs"
        onClick={changeSpeed}
        aria-label={t("audioPlayer.speed", { rate: speed })}
      >
        {speed}x
      </button>
    </div>
  );
}
