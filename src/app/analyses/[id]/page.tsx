"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetAnalysis, apiGetDocument, apiGetShareHash } from "@/lib/api";
import { fetchAndShareImage } from "@/lib/share-image";
import AudioPlayer from "@/components/AudioPlayer";
import {
  TosResult,
  ScamResult,
  GeneralResult,
  buildAudioText,
} from "@/components/AnalysisResults";
import {
  IoShareSocial,
  IoImage,
  IoAlert,
  IoHome,
} from "react-icons/io5";
import type {
  ApiAnalysis,
  ApiDocument,
  TosAnalysisSummary,
  ScamDetectionSummary,
  GeneralSummary,
} from "@/types";
import {
  computeProtectionScore,
  ANALYSIS_TYPE_LABELS,
  DOC_TYPE_LABELS,
  type DocType,
  type AnalysisType,
} from "@/types";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/Toast";

export default function AnalysisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;
  const { session, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<ApiAnalysis | null>(null);
  const [document, setDocument] = useState<ApiDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharingImage, setSharingImage] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    const load = async () => {
      try {
        const { analysis: a } = await apiGetAnalysis(analysisId);
        setAnalysis(a);
        try {
          const { document: doc } = await apiGetDocument(a.document_id);
          setDocument(doc);
        } catch {
          // Document may have been deleted — not critical
        }
      } catch {
        setError("Análise não encontrada");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session, authLoading, router, analysisId]);

  const handleShareLink = async () => {
    if (!analysis) return;
    try {
      const { hash } = await apiGetShareHash(analysis.id);
      const url = `${window.location.origin}/share/${analysis.id}?hash=${hash}`;
      if (navigator.share) {
        await navigator.share({ title: "Análise - Cláusula Oculta", url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copiado!", "success");
      }
    } catch {
      showToast("Erro ao compartilhar", "error");
    }
  };

  const handleShareImage = async () => {
    if (!analysis) return;
    setSharingImage(true);
    try {
      const { hash } = await apiGetShareHash(analysis.id);
      await fetchAndShareImage(analysis.id, hash);
    } catch {
      showToast("Erro ao gerar imagem", "error");
    } finally {
      setSharingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar backHref="/analyses" backLabel="Voltar" />
        <div className="pt-16">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-base-200 rounded w-2/3 mx-auto" />
              <div className="h-4 bg-base-200 rounded w-1/3 mx-auto" />
              <div className="h-64 bg-base-200 rounded-2xl" />
              <div className="h-32 bg-base-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar backHref="/analyses" backLabel="Voltar" />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <IoAlert className="text-6xl text-error mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold mb-3">
              {error || "Análise não encontrada"}
            </h2>
            <button
              className="btn btn-primary mt-4"
              onClick={() => router.push("/analyses")}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const protectionScore = computeProtectionScore(analysis.abuse_score);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar backHref="/analyses" backLabel="Voltar" />

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
              {document?.title || "Resultado da Análise"}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
              <span className="badge badge-sm badge-primary badge-outline">
                {ANALYSIS_TYPE_LABELS[analysis.analysis_type as AnalysisType] ||
                  analysis.analysis_type}
              </span>
              {document && (
                <span className="badge badge-sm badge-outline">
                  {DOC_TYPE_LABELS[document.doc_type as DocType] ||
                    document.doc_type}
                </span>
              )}
              <span className="text-xs text-base-content/40">
                {new Date(analysis.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Analysis results */}
          {analysis.analysis_type === "tos" && (
            <TosResult
              summary={analysis.summary as TosAnalysisSummary}
              protectionScore={protectionScore}
            />
          )}
          {analysis.analysis_type === "scam" && (
            <ScamResult summary={analysis.summary as ScamDetectionSummary} />
          )}
          {analysis.analysis_type === "general" && (
            <GeneralResult summary={analysis.summary as GeneralSummary} />
          )}

          {/* Audio Player */}
          {analysis.id && (
            <div className="mt-6">
              <AudioPlayer
                analysisId={analysis.id}
                initialUrl={analysis.audio_url}
                fallbackText={buildAudioText(
                  analysis.summary as unknown as Record<string, unknown>
                )}
              />
            </div>
          )}

          {/* Share actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              className="btn btn-outline flex-1 gap-2"
              onClick={handleShareLink}
              aria-label="Compartilhar link da análise"
            >
              <IoShareSocial />
              Compartilhar Link
            </button>
            <button
              className="btn btn-outline flex-1 gap-2"
              onClick={handleShareImage}
              disabled={sharingImage}
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
  );
}
