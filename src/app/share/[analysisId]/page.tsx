"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiGetShareCard } from "@/lib/api";
import type { ApiShareCard } from "@/types";
import { DOC_TYPE_LABELS, type DocType, computeProtectionScore } from "@/types";
import { IoShieldCheckmark, IoWarning, IoAlert } from "react-icons/io5";
import Navbar from "@/components/Navbar";

export default function SharePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [card, setCard] = useState<ApiShareCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = searchParams.get("hash");
    const analysisId = params.analysisId as string;

    if (!hash) {
      setError("Link de compartilhamento inválido");
      setLoading(false);
      return;
    }

    apiGetShareCard(analysisId, hash)
      .then(({ card }) => setCard(card))
      .catch(() => setError("Análise não encontrada ou link expirado"))
      .finally(() => setLoading(false));
  }, [params.analysisId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4">
        <IoAlert className="text-5xl text-error" />
        <p className="text-lg font-bold">{error}</p>
        <Link href="/" className="btn btn-primary">
          Ir para o início
        </Link>
      </div>
    );
  }

  const score = computeProtectionScore(card.abuseScore);
  const level = score >= 70 ? "good" : score >= 40 ? "medium" : "bad";
  const Icon = level === "good" ? IoShieldCheckmark : level === "medium" ? IoWarning : IoAlert;
  const color = level === "good" ? "text-success" : level === "medium" ? "text-warning" : "text-error";

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* Share card */}
      <div className="max-w-lg mx-auto px-6 py-12 pt-24">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center">
            <div
              className="radial-progress text-primary mb-4"
              style={
                {
                  "--value": score,
                  "--size": "6rem",
                  "--thickness": "0.5rem",
                } as React.CSSProperties
              }
              role="progressbar"
            >
              <span className="text-xl font-extrabold">{score}</span>
            </div>

            <h2 className="card-title text-xl">{card.documentTitle}</h2>

            <span className="badge badge-outline">
              {DOC_TYPE_LABELS[card.documentType as DocType] || card.documentType}
            </span>

            <div className={`flex items-center gap-1 ${color} mt-2`}>
              <Icon className="text-lg" />
              <span className="font-bold text-sm">
                {level === "good"
                  ? "Boa Proteção"
                  : level === "medium"
                  ? "Atenção Necessária"
                  : "Alto Risco"}
              </span>
            </div>

            {card.resumo && (
              <p className="text-sm text-base-content/60 mt-4 leading-relaxed">
                {card.resumo}
              </p>
            )}

            <p className="text-xs text-base-content/40 mt-4">
              Analisado em{" "}
              {new Date(card.createdAt).toLocaleDateString("pt-BR")}
            </p>

            <div className="card-actions mt-6">
              <Link href="/analyze" className="btn btn-primary">
                Analisar meu documento
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
