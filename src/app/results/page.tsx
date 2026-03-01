"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useExperience } from "@/contexts/ExperienceContext";
import { apiRunAnalysis, apiGetAnalysis, apiGetShareHash, ApiError } from "@/lib/api";
import { fetchAndShareImage } from "@/lib/share-image";
import StepIndicator from "@/components/StepIndicator";
import AudioPlayer from "@/components/AudioPlayer";
import QAPanel from "@/components/QAPanel";
import { ScoreGauge, TosResult, ScamResult, GeneralResult, buildAudioText } from "@/components/AnalysisResults";
import Link from "next/link";
import {
  IoShareSocial,
  IoImage,
  IoHome,
  IoAlert,
  IoRefresh,
} from "react-icons/io5";
import type {
  TosAnalysisSummary,
  ScamDetectionSummary,
  GeneralSummary,
  AnalysisDisplay,
} from "@/types";
import { computeProtectionScore } from "@/types";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/Toast";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

// ─── Main Page ───

export default function ResultsPage() {
  const router = useRouter();
  const { state, setAnalysisDisplay } = useApp();
  const { profile: xp } = useExperience();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [display, setDisplay] = useState<AnalysisDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sharingImage, setSharingImage] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!state.documentId) {
      router.replace("/analyze");
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runAnalysis = async () => {
      try {
        const { analysis: pipelineResult } = await apiRunAnalysis(
          state.documentId!,
          "auto"
        );

        const protectionScore = computeProtectionScore(
          pipelineResult.abuseScore
        );

        // Get full analysis record for audio_url
        const { analysis: fullAnalysis } = await apiGetAnalysis(
          pipelineResult.analysisId
        );

        const displayData: AnalysisDisplay = {
          analysisId: pipelineResult.analysisId,
          analysisType: fullAnalysis.analysis_type,
          protectionScore,
          summary: pipelineResult.summary,
          audioUrl: fullAnalysis.audio_url,
        };

        setDisplay(displayData);
        setAnalysisDisplay(displayData);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 429) {
            setError("Limite de análises atingido este mês.");
          } else {
            setError(err.message);
          }
        } else {
          setError("Erro ao analisar documento. Tente novamente.");
        }
        setIsLoading(false);
      }
    };

    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar statusText="Analisando..." />

        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <StepIndicator steps={STEPS} currentStep={3} />

            <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96">
              <span className="loading loading-dots loading-lg text-primary mb-6" />
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Análise profunda em andamento
                </h2>
                <p className="text-base-content/60 max-w-lg mx-auto">
                  A IA está identificando cláusulas, verificando conformidade e
                  gerando o resultado...
                </p>
                <p className="text-xs text-base-content/40 mt-4">
                  Isso pode levar de 10 a 30 segundos
                </p>
              </div>
              <div className="w-full max-w-md mt-8">
                <progress className="progress progress-primary w-full h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar backHref="/analyze" backLabel="Nova Análise" />

        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96">
              <IoAlert className="text-6xl text-error mb-4" />
              <h2 className="text-2xl font-extrabold mb-3">Erro na Análise</h2>
              <p className="text-base-content/60 text-center mb-6">{error}</p>
              <div className="flex gap-4">
                <button
                  className="btn btn-outline gap-2"
                  onClick={() => router.push("/analyze")}
                >
                  <IoHome className="text-lg" />
                  Nova Análise
                </button>
                <button
                  className="btn btn-primary gap-2"
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    hasStarted.current = false;
                    router.refresh();
                  }}
                >
                  <IoRefresh className="text-lg" />
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!display) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar
        backHref="/analyses"
        backLabel="Minhas Análises"
        pageAction={<Link href="/analyze" className="btn btn-primary btn-sm">Nova Análise</Link>}
      />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={3} />

          <div className="mt-8 max-w-3xl mx-auto">
            {/* Document title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                {state.document?.title || "Resultado da Análise"}
              </h2>
              <p className="text-base-content/50">Análise concluída</p>
            </div>

            {xp.showGuidanceText && (
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Dica: Role para ver todos os detalhes. Use o botão de áudio para ouvir.</span>
              </div>
            )}

            {/* Render based on analysis type */}
            {display.analysisType === "tos" && (
              <TosResult
                summary={display.summary as TosAnalysisSummary}
                protectionScore={display.protectionScore}
              />
            )}
            {display.analysisType === "scam" && (
              <ScamResult summary={display.summary as ScamDetectionSummary} />
            )}
            {display.analysisType === "general" && (
              <GeneralResult summary={display.summary as GeneralSummary} />
            )}

            {/* Audio Player */}
            {display.analysisId && (
              <div className="mt-6">
                <AudioPlayer
                  analysisId={display.analysisId}
                  initialUrl={display.audioUrl}
                  fallbackText={buildAudioText(display.summary as unknown as Record<string, unknown>)}
                />
              </div>
            )}

            {/* Q&A Panel */}
            {display.analysisId && (
              <div className="mt-6">
                <QAPanel analysisId={display.analysisId} />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                className="btn btn-outline flex-1 gap-2"
                onClick={async () => {
                  try {
                    const { hash } = await apiGetShareHash(display.analysisId);
                    const url = `${window.location.origin}/share/${display.analysisId}?hash=${hash}`;
                    if (navigator.share) {
                      await navigator.share({ title: "Análise - Cláusula Oculta", url });
                    } else {
                      await navigator.clipboard.writeText(url);
                      showToast("Link copiado!", "success");
                    }
                  } catch {
                    showToast("Erro ao compartilhar", "error");
                  }
                }}
                aria-label="Compartilhar link da análise"
              >
                <IoShareSocial />
                Compartilhar Link
              </button>
              <button
                className="btn btn-outline flex-1 gap-2"
                disabled={sharingImage}
                onClick={async () => {
                  setSharingImage(true);
                  try {
                    const { hash } = await apiGetShareHash(display.analysisId);
                    await fetchAndShareImage(display.analysisId, hash);
                  } catch {
                    showToast("Erro ao gerar imagem", "error");
                  } finally {
                    setSharingImage(false);
                  }
                }}
                aria-label="Compartilhar imagem da análise"
              >
                {sharingImage ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <IoImage />
                )}
                Compartilhar Imagem
              </button>
              <button
                className="btn btn-primary flex-1 gap-2"
                onClick={() => router.push("/analyze")}
              >
                <IoHome />
                Analisar outro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
