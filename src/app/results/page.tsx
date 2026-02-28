"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { apiRunAnalysis, apiGetAnalysis, apiGetShareHash, ApiError } from "@/lib/api";
import StepIndicator from "@/components/StepIndicator";
import AudioPlayer from "@/components/AudioPlayer";
import QAPanel from "@/components/QAPanel";
import { ScoreGauge, TosResult, ScamResult, GeneralResult, buildAudioText } from "@/components/AnalysisResults";
import {
  IoShareSocial,
  IoImage,
  IoHome,
  IoShield,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

// ─── Main Page ───

export default function ResultsPage() {
  const router = useRouter();
  const { state, setAnalysisDisplay } = useApp();
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
        // Determine analysis type based on doc_type
        const docType = state.document?.doc_type;
        let analysisType: "tos" | "scam" | "general" = "tos";
        if (docType === "mensagem_suspeita") {
          analysisType = "scam";
        } else if (
          docType === "notificacao_judicial" ||
          docType === "carta_inss"
        ) {
          analysisType = "general";
        }

        const { analysis: pipelineResult } = await apiRunAnalysis(
          state.documentId!,
          analysisType
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
        <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <IoShield className="w-5 h-5 text-black" />
              </div>
              Cláusula Oculta
            </button>
            <span className="text-sm text-base-content/60">Analisando...</span>
          </div>
        </nav>

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
        <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <IoShield className="w-5 h-5 text-black" />
              </div>
              Cláusula Oculta
            </button>
          </div>
        </nav>

        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96">
              <IoAlert className="text-6xl text-error mb-4" />
              <h2 className="text-2xl font-extrabold mb-3">Erro na Análise</h2>
              <p className="text-base-content/60 text-center mb-6">{error}</p>
              <div className="flex gap-4">
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => router.push("/analyze")}
                >
                  <IoHome className="text-lg" />
                  Nova Análise
                </button>
                <button
                  className="btn btn-primary btn-lg gap-2"
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

  const handleClauseClick = (index: number) => {
    router.push(`/clause/${index}`);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <IoShield className="w-5 h-5 text-black" />
            </div>
            Cláusula Oculta
          </button>
          <button
            onClick={() => router.push("/analyze")}
            className="px-4 py-2 bg-base-200 text-base-content font-semibold text-sm rounded-lg hover:bg-base-300 transition-colors"
          >
            Nova Análise
          </button>
        </div>
      </nav>

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

            {/* Render based on analysis type */}
            {display.analysisType === "tos" && (
              <TosResult
                summary={display.summary as TosAnalysisSummary}
                protectionScore={display.protectionScore}
                onClauseClick={handleClauseClick}
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
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <button
                className="btn btn-outline btn-lg gap-2"
                onClick={async () => {
                  try {
                    const { hash } = await apiGetShareHash(display.analysisId);
                    const url = `${window.location.origin}/share/${display.analysisId}?hash=${hash}`;
                    if (navigator.share) {
                      await navigator.share({ title: "Análise - Cláusula Oculta", url });
                    } else {
                      await navigator.clipboard.writeText(url);
                      alert("Link copiado!");
                    }
                  } catch {
                    alert("Erro ao compartilhar");
                  }
                }}
              >
                <IoShareSocial />
                Compartilhar Link
              </button>
              <button
                className="btn btn-outline btn-lg gap-2"
                disabled={sharingImage}
                onClick={async () => {
                  setSharingImage(true);
                  try {
                    const { hash } = await apiGetShareHash(display.analysisId);
                    const res = await fetch(
                      `${API_URL}/api/share/${display.analysisId}/image?hash=${hash}`
                    );
                    if (!res.ok) throw new Error("Failed to generate image");
                    const blob = await res.blob();
                    const file = new File([blob], "analise-clausula-oculta.png", {
                      type: "image/png",
                    });
                    if (navigator.canShare?.({ files: [file] })) {
                      await navigator.share({
                        title: "Análise - Cláusula Oculta",
                        files: [file],
                      });
                    } else {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "analise-clausula-oculta.png";
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  } catch {
                    alert("Erro ao gerar imagem");
                  } finally {
                    setSharingImage(false);
                  }
                }}
              >
                {sharingImage ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <IoImage />
                )}
                Compartilhar Imagem
              </button>
              <button
                className="btn btn-primary btn-lg gap-2"
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
