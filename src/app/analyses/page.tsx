"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { apiListAnalyses } from "@/lib/api";
import type { ApiAnalysisListItem } from "@/types";
import {
  computeProtectionScore,
  type DocType,
  type AnalysisType,
} from "@/types";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoDocumentText,
  IoSearch,
} from "react-icons/io5";
import Navbar from "@/components/Navbar";

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
  const { t } = useTranslation();
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
      <Navbar pageAction={<Link href="/analyze" className="btn btn-primary btn-sm">{t("analyses.newAnalysis")}</Link>} />

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-2">{t("analyses.title")}</h1>
          <p className="text-base-content/60 mb-8">
            {t("analyses.subtitle")}
          </p>

          {loading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card bg-base-200 p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-base-300 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-base-300 rounded w-2/3" />
                      <div className="h-3 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <IoSearch className="text-4xl text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("analyses.emptyTitle")}</h3>
              <p className="text-base-content/50 mb-6 max-w-sm mx-auto">
                {t("analyses.emptyDesc")}
              </p>
              <Link href="/analyze" className="btn btn-primary">
                {t("analyses.emptyCta")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {analyses.map((item) => {
                return (
                  <button
                    key={item.id}
                    className="card bg-base-200 w-full text-left cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/analyses/${item.id}`)}
                    aria-label={t("analyses.viewAria", { title: item.documentTitle })}
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <ScoreIndicator abuseScore={item.abuseScore} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {item.documentTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="badge badge-sm badge-primary badge-outline">
                            {t("analysisTypes." + item.analysisType) || item.analysisType}
                          </span>
                          <span className="badge badge-sm badge-outline">
                            {t("docTypes." + item.documentType) || item.documentType}
                          </span>
                          <span className="text-xs text-base-content/40">
                            {new Date(item.createdAt).toLocaleDateString()}
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
