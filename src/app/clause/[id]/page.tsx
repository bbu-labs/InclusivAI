"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import {
  IoWarning,
  IoBook,
  IoFlash,
} from "react-icons/io5";
import type { TosAnalysisSummary, Gravidade } from "@/types";
import { getGravidadeBadge, getGravidadeLabel } from "@/types";
import Navbar from "@/components/Navbar";

interface ClauseData {
  texto_original: string;
  explicacao_simples: string;
  artigo_cdc: string;
  gravidade: Gravidade;
}

export default function ClauseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const [clause, setClause] = useState<ClauseData | null>(null);

  useEffect(() => {
    if (!state.analysisDisplay || state.analysisDisplay.analysisType !== "tos") {
      router.replace("/results");
      return;
    }

    const summary = state.analysisDisplay.summary as TosAnalysisSummary;
    const index = parseInt(params.id as string, 10);

    if (isNaN(index) || index < 0 || index >= summary.clausulas_abusivas.length) {
      router.replace("/results");
      return;
    }

    setClause(summary.clausulas_abusivas[index]);
  }, [state.analysisDisplay, params.id, router]);

  if (!clause) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar
        rightAction={
          <button
            onClick={() => router.push("/results")}
            className="btn btn-ghost btn-sm"
            aria-label="Voltar aos resultados"
          >
            Voltar aos Resultados
          </button>
        }
      />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mt-8 max-w-3xl mx-auto">
            {/* Gravidade badge */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${getGravidadeBadge(clause.gravidade)} badge-lg`}>
                  Gravidade {getGravidadeLabel(clause.gravidade)}
                </span>
                {clause.artigo_cdc && (
                  <span className="badge badge-outline badge-lg">
                    {clause.artigo_cdc}
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Cláusula Abusiva
              </h2>
            </div>

            <div className="grid gap-6">
              {/* Original text */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <IoBook className="text-base-content/50" />
                  Texto Original
                </h3>
                <div className="bg-base-200 rounded-2xl p-6">
                  <p className="text-sm text-base-content/70 leading-relaxed italic">
                    &ldquo;{clause.texto_original}&rdquo;
                  </p>
                </div>
              </div>

              {/* Simplified explanation */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <IoFlash className="text-primary" />
                  Em linguagem simples
                </h3>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <p className="text-base text-base-content leading-relaxed">
                    {clause.explicacao_simples}
                  </p>
                </div>
              </div>

              {/* CDC Reference */}
              {clause.artigo_cdc && (
                <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-warning mb-3 flex items-center gap-2">
                    <IoWarning className="text-xl" />
                    Referência Legal
                  </h3>
                  <p className="text-base text-base-content/70">
                    {clause.artigo_cdc}
                  </p>
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
