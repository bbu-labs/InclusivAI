"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoBook,
  IoFlash,
  IoShield,
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
    <div className="min-h-screen bg-base-100">
      {/* ───── Navbar ───── */}
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
            onClick={() => router.push("/results")}
            className="px-4 py-2 bg-base-200 text-base-content font-semibold text-sm rounded-lg hover:bg-base-300 transition-colors"
          >
            Voltar aos Resultados
          </button>
        </div>
      </nav>

      {/* ───── Main Content ───── */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mt-8 max-w-3xl mx-auto">
          {/* Risk badge + title */}
          <div className="mb-8">
            <div className={`badge ${getRiskBadge(clause.riskLevel)} badge-lg mb-4`}>
              {getRiskLabel(clause.riskLevel)}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold">{clause.title}</h2>
          </div>

          <div className="grid gap-6">
            {/* Risk indicator */}
            <div
              className={`flex items-center gap-4 p-6 rounded-2xl border ${getRiskBgColor(
                clause.riskLevel
              )}`}
            >
              <RiskIcon className={`text-4xl ${getRiskColor(clause.riskLevel)}`} />
              <div>
                <p className={`font-bold text-lg ${getRiskColor(clause.riskLevel)}`}>
                  {getRiskLabel(clause.riskLevel)}
                </p>
                <p className="text-sm text-base-content/60">{clause.impact}</p>
              </div>
            </div>

            {/* Original text */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <IoBook className="text-base-content/50" />
                Texto Original
              </h3>
              <div className="bg-base-200 rounded-2xl p-6">
                <p className="text-sm text-base-content/70 leading-relaxed italic">
                  “{clause.originalText}”
                </p>
              </div>
            </div>

            {/* Simplified text */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <IoFlash className="text-primary" />
                Em linguagem simples
              </h3>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <p className="text-base text-base-content leading-relaxed">
                  {clause.simplifiedText}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="font-bold text-lg mb-4">Por que isso importa?</h3>
              <p className="text-base text-base-content/70 leading-relaxed">
                {clause.explanation}
              </p>
            </div>

            {/* CDC Reference */}
            {clause.cdcReference && (
              <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-warning mb-3 flex items-center gap-2">
                  <IoWarning className="text-xl" />
                  Referência Legal
                </h3>
                <p className="text-base text-base-content/70">{clause.cdcReference}</p>
              </div>
            )}

            {/* Back button */}
            <button
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={() => router.push("/results")}
            >
              Voltar para o Resultado
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
