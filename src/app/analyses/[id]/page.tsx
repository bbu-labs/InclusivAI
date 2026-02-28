"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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
  IoShield,
  IoArrowBack,
  IoShareSocial,
  IoImage,
  IoAlert,
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

export default function AnalysisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;
  const { session, isLoading: authLoading } = useAuth();
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
        alert("Link copiado!");
      }
    } catch {
      alert("Erro ao compartilhar");
    }
  };

  const handleShareImage = async () => {
    if (!analysis) return;
    setSharingImage(true);
    try {
      const { hash } = await apiGetShareHash(analysis.id);
      await fetchAndShareImage(analysis.id, hash);
    } catch {
      alert("Erro ao gerar imagem");
    } finally {
      setSharingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
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
          </div>
        </nav>
        <div className="pt-16 flex justify-center py-24">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-base-100">
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
          </div>
        </nav>
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
          <button
            onClick={() => router.push("/analyses")}
            className="btn btn-ghost btn-sm gap-1"
          >
            <IoArrowBack />
            Voltar
          </button>
        </div>
      </nav>

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
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <button
              className="btn btn-outline btn-lg gap-2"
              onClick={handleShareLink}
            >
              <IoShareSocial />
              Compartilhar Link
            </button>
            <button
              className="btn btn-outline btn-lg gap-2"
              onClick={handleShareImage}
              disabled={sharingImage}
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
              Analisar outro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
