"use client";

import { useTranslation } from "react-i18next";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
} from "react-icons/io5";
import type {
  TosAnalysisSummary,
  ScamDetectionSummary,
  GeneralSummary,
  Gravidade,
} from "@/types";
import { getGravidadeBadge } from "@/types";

// ─── Score Gauge ───

export function ScoreGauge({ score }: { score: number }) {
  const { t } = useTranslation();
  const level = score >= 70 ? "good" : score >= 40 ? "medium" : "bad";
  const color =
    level === "good"
      ? "text-success"
      : level === "medium"
      ? "text-warning"
      : "text-error";
  const label =
    level === "good"
      ? t("analysisResults.goodProtection")
      : level === "medium"
      ? t("analysisResults.attentionNeeded")
      : t("analysisResults.highRisk");
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

export function TosResult({
  summary,
  protectionScore,
}: {
  summary: TosAnalysisSummary;
  protectionScore: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6">
      {/* Score */}
      <div className="flex justify-center">
        <ScoreGauge score={protectionScore} />
      </div>

      {/* Resumo */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">{t("analysisResults.summary")}</h3>
        <p className="text-base-content/70 leading-relaxed">{summary.resumo}</p>
      </div>

      {/* Cláusulas abusivas */}
      {summary.clausulas_abusivas.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">
            {t("analysisResults.abusiveClauses", { count: summary.clausulas_abusivas.length })}
          </h3>
          <div className="grid gap-3">
            {summary.clausulas_abusivas.map((clause, index) => (
              <div
                key={index}
                className="card bg-base-200 w-full"
              >
                <div className="card-body p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`badge badge-sm ${getGravidadeBadge(
                        clause.gravidade
                      )}`}
                    >
                      {t("severity." + clause.gravidade)}
                    </span>
                    {(clause.base_legal || clause.artigo_cdc) && (
                      <span className="text-xs text-base-content/50">
                        {clause.base_legal || clause.artigo_cdc}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-base-content/80 mt-1">
                    {clause.explicacao_simples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pontos positivos */}
      {summary.pontos_positivos.length > 0 && (
        <div className="bg-success/5 border border-success/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-success mb-4 flex items-center gap-2">
            <IoShieldCheckmark className="text-xl" />
            {t("analysisResults.positivePoints")}
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
        <h3 className="font-bold text-lg text-primary mb-4">{t("analysisResults.recommendation")}</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.recomendacao}
        </p>
      </div>
    </div>
  );
}

// ─── Scam Result ───

export function ScamResult({ summary }: { summary: ScamDetectionSummary }) {
  const { t } = useTranslation();
  const classLabel = {
    golpe_provavel: t("analysisResults.scamProbable"),
    suspeito: t("analysisResults.suspicious"),
    aparentemente_legitimo: t("analysisResults.apparentlyLegit"),
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
          {t("analysisResults.confidence", { value: summary.confianca })}
        </p>
      </div>

      {/* Explicação */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">{t("analysisResults.explanation")}</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.explicacao}
        </p>
      </div>

      {/* Sinais de alerta */}
      {summary.sinais_alerta.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-error mb-4 flex items-center gap-2">
            <IoAlert className="text-xl" />
            {t("analysisResults.warningSignals")}
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
          {t("analysisResults.recommendedAction")}
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
            {t("analysisResults.whereToReport")}
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

export function GeneralResult({ summary }: { summary: GeneralSummary }) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6">
      {/* Resumo executivo */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">{t("analysisResults.executiveSummary")}</h3>
        <p className="text-base-content/70 leading-relaxed">
          {summary.resumo_executivo}
        </p>
      </div>

      {/* Pontos críticos */}
      {summary.pontos_criticos.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-error mb-4 flex items-center gap-2">
            <IoAlert className="text-xl" />
            {t("analysisResults.criticalPoints")}
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
                    {t("severity." + p.urgencia)}
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
            {t("analysisResults.recommendedActions")}
          </h3>
          <div className="grid gap-3">
            {summary.acoes_recomendadas.map((a, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <p className="font-bold text-sm">
                  {i + 1}. {a.acao}
                </p>
                {a.prazo && (
                  <p className="text-xs text-warning mt-1">{t("analysisResults.deadline", { value: a.prazo })}</p>
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
            {t("analysisResults.importantDeadlines")}
          </h3>
          <div className="grid gap-3">
            {summary.prazos.map((p, i) => (
              <div key={i} className="bg-base-100 rounded-xl p-4">
                <p className="font-bold text-sm">{p.descricao}</p>
                <p className="text-xs text-error mt-1">
                  {t("analysisResults.deadlineLimit", { date: p.data_limite })}
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
          <h3 className="font-bold text-lg mb-4">{t("analysisResults.legalBasis")}</h3>
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

// ─── Audio text builder ───

export function buildAudioText(summary: Record<string, unknown>): string {
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
