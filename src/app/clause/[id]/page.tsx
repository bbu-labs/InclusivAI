"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoBook,
  IoFlash,
} from "react-icons/io5";
import type { Clause, RiskLevel } from "@/types";

function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "text-success";
    case "medio":
      return "text-warning";
    case "alto":
      return "text-error";
  }
}

function getRiskBgColor(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "bg-success/10 border-success/30";
    case "medio":
      return "bg-warning/10 border-warning/30";
    case "alto":
      return "bg-error/10 border-error/30";
  }
}

function getRiskBadge(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "badge-success";
    case "medio":
      return "badge-warning";
    case "alto":
      return "badge-error";
  }
}

function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "Baixo Risco";
    case "medio":
      return "Médio Risco";
    case "alto":
      return "Alto Risco";
  }
}

function getRiskIcon(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return IoShieldCheckmark;
    case "medio":
      return IoWarning;
    case "alto":
      return IoAlert;
  }
}

export default function ClauseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const [clause, setClause] = useState<Clause | null>(null);

  useEffect(() => {
    if (!state.analysisResult) {
      router.replace("/");
      return;
    }
    const found = state.analysisResult.clauses.find(
      (c) => c.id === params.id
    );
    if (found) {
      setClause(found);
    } else {
      router.replace("/results");
    }
  }, [state.analysisResult, params.id, router]);

  if (!clause) return null;

  const RiskIcon = getRiskIcon(clause.riskLevel);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Detalhe da Cláusula" showBack backTo="/results" />

      <div className="flex-1 px-6 py-6 flex flex-col gap-5">
        {/* Risk badge + title */}
        <div>
          <div className={`badge ${getRiskBadge(clause.riskLevel)} mb-2`}>
            {getRiskLabel(clause.riskLevel)}
          </div>
          <h2 className="text-xl font-bold">{clause.title}</h2>
        </div>

        {/* Risk indicator */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${getRiskBgColor(
            clause.riskLevel
          )}`}
        >
          <RiskIcon className={`text-3xl ${getRiskColor(clause.riskLevel)}`} />
          <div>
            <p className={`font-bold text-sm ${getRiskColor(clause.riskLevel)}`}>
              {getRiskLabel(clause.riskLevel)}
            </p>
            <p className="text-xs text-base-content/60">{clause.impact}</p>
          </div>
        </div>

        {/* Original text */}
        <div>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <IoBook className="text-base-content/50" />
            Texto Original
          </h3>
          <div className="bg-base-200 rounded-xl p-4">
            <p className="text-xs text-base-content/70 leading-relaxed italic">
              &ldquo;{clause.originalText}&rdquo;
            </p>
          </div>
        </div>

        {/* Simplified text */}
        <div>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <IoFlash className="text-primary" />
            Em linguagem simples
          </h3>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-base-content leading-relaxed">
              {clause.simplifiedText}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h3 className="font-bold text-sm mb-2">Por que isso importa?</h3>
          <p className="text-sm text-base-content/70 leading-relaxed">
            {clause.explanation}
          </p>
        </div>

        {/* CDC Reference */}
        {clause.cdcReference && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
            <h3 className="font-bold text-sm text-warning mb-1 flex items-center gap-2">
              <IoWarning />
              Referência Legal
            </h3>
            <p className="text-sm text-base-content/70">{clause.cdcReference}</p>
          </div>
        )}

        {/* Back button */}
        <button
          className="btn btn-primary w-full mt-auto"
          onClick={() => router.push("/results")}
        >
          Voltar para o Resultado
        </button>
      </div>
    </div>
  );
}
