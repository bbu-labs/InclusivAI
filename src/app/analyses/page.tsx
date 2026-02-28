"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiListAnalyses } from "@/lib/api";
import type { ApiAnalysisListItem } from "@/types";
import {
  computeProtectionScore,
  ANALYSIS_TYPE_LABELS,
  DOC_TYPE_LABELS,
  type DocType,
  type AnalysisType,
} from "@/types";
import {
  IoShield,
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoDocumentText,
} from "react-icons/io5";

function ScoreIndicator({ abuseScore }: { abuseScore: number | null }) {
  const score = computeProtectionScore(abuseScore);
  const level = score >= 70 ? "good" : score >= 40 ? "medium" : "bad";

  const bgColor =
    level === "good"
      ? "bg-success/10 text-success"
      : level === "medium"
      ? "bg-warning/10 text-warning"
      : "bg-error/10 text-error";

  const Icon =
    level === "good"
      ? IoShieldCheckmark
      : level === "medium"
      ? IoWarning
      : IoAlert;

  return (
    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${bgColor}`}>
      <Icon className="text-lg" />
      <span className="text-xs font-extrabold">{score}</span>
    </div>
  );
}

export default function AnalysesPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<ApiAnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    apiListAnalyses()
      .then(({ analyses }) => setAnalyses(analyses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, authLoading, router]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <IoShield className="w-5 h-5 text-black" />
            </div>
            Cláusula Oculta
          </Link>
          <Link href="/analyze" className="btn btn-primary btn-sm">
            Nova Análise
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-2">Minhas Análises</h1>
          <p className="text-base-content/60 mb-8">
            Resultados das suas análises anteriores
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <IoDocumentText className="text-6xl text-base-content/20 mx-auto mb-4" />
              <p className="text-base-content/50 mb-4">
                Você ainda não fez nenhuma análise.
              </p>
              <Link href="/analyze" className="btn btn-primary">
                Analisar agora
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {analyses.map((item) => {
                const protectionScore = computeProtectionScore(item.abuseScore);
                return (
                  <button
                    key={item.id}
                    className="card bg-base-200 w-full text-left cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/analyses/${item.id}`)}
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <ScoreIndicator abuseScore={item.abuseScore} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {item.documentTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="badge badge-sm badge-primary badge-outline">
                            {ANALYSIS_TYPE_LABELS[item.analysisType as AnalysisType] || item.analysisType}
                          </span>
                          <span className="badge badge-sm badge-outline">
                            {DOC_TYPE_LABELS[item.documentType as DocType] || item.documentType}
                          </span>
                          <span className="text-xs text-base-content/40">
                            {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        {item.summaryPreview && (
                          <p className="text-xs text-base-content/50 mt-2 line-clamp-2">
                            {item.summaryPreview}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
