"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { apiRunAnalysis, apiGetAnalysis, apiGetShareHash, ApiError } from "@/lib/api";
import StepIndicator from "@/components/StepIndicator";
import AudioPlayer from "@/components/AudioPlayer";
import QAPanel from "@/components/QAPanel";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoChevronForward,
  IoShareSocial,
  IoHome,
  IoShield,
  IoRefresh,
} from "react-icons/io5";
import type {
  TosAnalysisSummary,
  ScamDetectionSummary,
  GeneralSummary,
  AnalysisDisplay,
  Gravidade,
} from "@/types";
import {
  computeProtectionScore,
  getGravidadeBadge,
  getGravidadeLabel,
} from "@/types";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

/** Build the same text the backend would send to TTS, for browser fallback */
function buildAudioText(summary: Record<string, unknown>): string {
  let text = "";
  if (summary.resumo) text += summary.resumo + "\n\n";
  if (summary.resumo_executivo) text += summary.resumo_executivo + "\n\n";
  if (summary.explicacao) text += summary.explicacao + "\n\n";
  if (summary.recomendacao) text += "Recomendação: " + summary.recomendacao + "\n\n";
  if (summary.acao_recomendada) text += "Ação recomendada: " + summary.acao_recomendada + "\n\n";
  if (Array.isArray(summary.pontos_criticos)) {
    for (const p of summary.pontos_criticos as Array<{ item: string; explicacao: string }>) {
      text += `${p.item}: ${p.explicacao}\n`;
    }
  }
  return text.trim();
}

// ─── Score Gauge ───

function ScoreGauge({ score }: { score: number }) {
  const level = score >= 70 ? "good" : score >= 40 ? "medium" : "bad";
  const color =
    level === "good"
      ? "text-success"
      : level === "medium"
      ? "text-warning"
      : "text-error";
  const label =
    level === "good"
      ? "Boa Proteção"
      : level === "medium"
      ? "Atenção Necessária"
      : "Alto Risco";
  const Icon =
    level === "good"
      ? IoShieldCheckmark
      : level === "medium"
      ? IoWarning
      : IoAlert;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="radial-progress text-primary"
        style={
          {
            "--value": score,
            "--size": "8rem",
            "--thickness": "0.6rem",
          } as React.CSSProperties
        }
        role="progressbar"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl font-extrabold">{score}</span>
          <span className="text-xs text-base-content/50">/100</span>
        </div>
      </div>
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="text-lg" />
        <span className="font-bold text-sm">{label}</span>
      </div>
    </div>
  );
}

// ─── TOS Result ───

function TosResult({
  summary,
  protectionScore,
  onClauseClick,
}: {
  summary: TosAnalysisSummary;
  protectionScore: number;
  onClauseClick: (index: number) => void;
}) {
  return (
    <div className="grid gap-6">
      {/* Score */}
      <div className="flex justify-center">
        <ScoreGauge score={protectionScore} />
      </div>

      {/* Resumo */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Resumo da Análise</h3>
        <p className="text-base-content/70 leading-relaxed">{summary.resumo}</p>
      </div>

      {/* Cláusulas abusivas */}
      {summary.clausulas_abusivas.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">
            Cláusulas Abusivas ({summary.clausulas_abusivas.length})
          </h3>
          <div className="grid gap-3">
            {summary.clausulas_abusivas.map((clause, index) => (
              <button
                key={index}
                className="card bg-base-200 w-full text-left cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onClauseClick(index)}
              >
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`badge badge-sm ${getGravidadeBadge(
                            clause.gravidade
                          )}`}
                        >
                          {getGravidadeLabel(clause.gravidade)}
                        </span>
                        {clause.artigo_cdc && (
                          <span className="badge badge-sm badge-outline">
                            {clause.artigo_cdc}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-base-content/80 mt-1 line-clamp-2">
                        {clause.explicacao_simples}
                      </p>
                    </div>
                    <IoChevronForward className="text-lg text-base-content/30 flex-shrink-0 mt-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pontos positivos */}
      {summary.pontos_positivos.length > 0 && (
        <div className="bg-success/5 border border-success/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-success mb-4 flex items-center gap-2">
            <IoShieldCheckmark className="text-xl" />
            Pontos Positivos
          </h3>
          <ul className="space-y-2">
            {summary.pontos_positivos.map((ponto, i) => (
              <li key={i} className="text-sm text-base-content/70 flex gap-3">
                <span className="text-success font-bold">+</span>
                <span>{ponto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recomendação */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-primary mb-4">Recomendação</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.recomendacao}
        </p>
      </div>
    </div>
  );
}

// ─── Scam Result ───

function ScamResult({ summary }: { summary: ScamDetectionSummary }) {
  const classLabel = {
    golpe_provavel: "Golpe Provável",
    suspeito: "Suspeito",
    aparentemente_legitimo: "Aparentemente Legítimo",
  }[summary.classificacao];

  const classBadge = {
    golpe_provavel: "badge-error",
    suspeito: "badge-warning",
    aparentemente_legitimo: "badge-success",
  }[summary.classificacao];

  return (
    <div className="grid gap-6">
      {/* Classification badge */}
      <div className="flex flex-col items-center gap-3">
        <span className={`badge ${classBadge} badge-lg text-lg px-6 py-4`}>
          {classLabel}
        </span>
        <p className="text-sm text-base-content/50">
          Confiança: {summary.confianca}%
        </p>
      </div>

      {/* Explicação */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Explicação</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.explicacao}
        </p>
      </div>

      {/* Sinais de alerta */}
      {summary.sinais_alerta.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-error mb-4 flex items-center gap-2">
            <IoAlert className="text-xl" />
            Sinais de Alerta
          </h3>
          <ul className="space-y-2">
            {summary.sinais_alerta.map((sinal, i) => (
              <li key={i} className="text-sm text-base-content/70 flex gap-3">
                <span className="text-error font-bold">!</span>
                <span>{sinal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ação recomendada */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-primary mb-4">
          Ação Recomendada
        </h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.acao_recomendada}
        </p>
      </div>

      {/* Onde denunciar */}
      {summary.onde_denunciar.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-warning mb-4 flex items-center gap-2">
            <IoWarning className="text-xl" />
            Onde Denunciar
          </h3>
          <div className="grid gap-4">
            {summary.onde_denunciar.map((d, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <p className="font-bold text-sm">{d.orgao}</p>
                <p className="text-xs text-base-content/60 mt-1">{d.como}</p>
                <p className="text-xs text-primary mt-1">{d.contato}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── General Result ───

function GeneralResult({ summary }: { summary: GeneralSummary }) {
  return (
    <div className="grid gap-6">
      {/* Resumo executivo */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Resumo Executivo</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.resumo_executivo}
        </p>
      </div>

      {/* Pontos críticos */}
      {summary.pontos_criticos.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-error mb-4 flex items-center gap-2">
            <IoAlert className="text-xl" />
            Pontos Críticos
          </h3>
          <div className="grid gap-3">
            {summary.pontos_criticos.map((p, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`badge badge-sm ${getGravidadeBadge(
                      p.urgencia as Gravidade
                    )}`}
                  >
                    {getGravidadeLabel(p.urgencia as Gravidade)}
                  </span>
                </div>
                <p className="font-bold text-sm">{p.item}</p>
                <p className="text-xs text-base-content/60 mt-1">
                  {p.explicacao}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ações recomendadas */}
      {summary.acoes_recomendadas.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-primary mb-4">
            Ações Recomendadas
          </h3>
          <div className="grid gap-3">
            {summary.acoes_recomendadas.map((a, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <p className="font-bold text-sm">
                  {i + 1}. {a.acao}
                </p>
                {a.prazo && (
                  <p className="text-xs text-warning mt-1">Prazo: {a.prazo}</p>
                )}
                <p className="text-xs text-base-content/60 mt-1">
                  {a.como_fazer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prazos */}
      {summary.prazos.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-warning mb-4 flex items-center gap-2">
            <IoWarning className="text-xl" />
            Prazos Importantes
          </h3>
          <div className="grid gap-3">
            {summary.prazos.map((p, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <p className="font-bold text-sm">{p.descricao}</p>
                <p className="text-xs text-error mt-1">
                  Limite: {p.data_limite}
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  {p.consequencia}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Base legal */}
      {summary.base_legal.length > 0 && (
        <div className="bg-base-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Base Legal</h3>
          <div className="grid gap-2">
            {summary.base_legal.map((b, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-bold text-primary whitespace-nowrap">
                  {b.lei} - {b.artigo}
                </span>
                <span className="text-base-content/60">{b.relevancia}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───

export default function ResultsPage() {
  const router = useRouter();
  const { state, setAnalysisDisplay } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [display, setDisplay] = useState<AnalysisDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);
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
            <div className="grid md:grid-cols-2 gap-4 mt-6">
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
                Compartilhar
              </button>
              <button
                className="btn btn-primary btn-lg gap-2"
                onClick={() => router.push("/analyze")}
              >
                <IoHome />
                Analisar outro documento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
