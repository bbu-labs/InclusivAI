"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetRanking } from "@/lib/api";
import type { ApiRanking } from "@/types";
import { IoTrophy, IoWarning, IoRemove, IoCheckmarkCircle } from "react-icons/io5";
import Navbar from "@/components/Navbar";

export default function RankingPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const [rankings, setRankings] = useState<ApiRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    apiGetRanking()
      .then(({ rankings }) => setRankings(rankings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, authLoading, router]);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <IoTrophy className="text-3xl text-warning" />
              <h1 className="text-3xl font-extrabold">Ranking de Empresas</h1>
            </div>
            <p className="text-base-content/60 max-w-lg mx-auto">
              Empresas ordenadas por nota média de abusividade nos termos de uso
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-base-200 rounded-xl animate-pulse">
                  <div className="w-8 h-8 bg-base-300 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-base-300 rounded w-1/3" />
                    <div className="h-3 bg-base-300 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-16 bg-base-300 rounded-full" />
                </div>
              ))}
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12">
              <IoTrophy className="text-6xl text-base-content/20 mx-auto mb-4" />
              <p className="text-base-content/50 mb-4">Nenhuma empresa no ranking ainda.</p>
              <Link href="/analyze" className="btn btn-primary">
                Analisar um documento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Empresa</th>
                    <th>Nota Abusividade</th>
                    <th>Análises</th>
                    <th className="hidden md:table-cell">Última Análise</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, i) => {
                    const isHigh = r.avg_abuse_score >= 7;
                    const isMedium = r.avg_abuse_score >= 4 && r.avg_abuse_score < 7;
                    const severityLabel = isHigh ? "Alto" : isMedium ? "Médio" : "Baixo";
                    const SeverityIcon = isHigh ? IoWarning : isMedium ? IoRemove : IoCheckmarkCircle;

                    return (
                      <tr key={r.id}>
                        <td className="font-bold">{i + 1}</td>
                        <td className="font-medium break-words max-w-[200px]">{r.company_name}</td>
                        <td>
                          <span
                            className={`badge gap-1 ${
                              isHigh
                                ? "badge-error"
                                : isMedium
                                ? "badge-warning"
                                : "badge-success"
                            }`}
                          >
                            <SeverityIcon className="text-xs" />
                            {severityLabel}: {r.avg_abuse_score.toFixed(1)}/10
                          </span>
                        </td>
                        <td>{r.total_analyses}</td>
                        <td className="text-xs text-base-content/50 hidden md:table-cell">
                          {new Date(r.last_analysis_at).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
