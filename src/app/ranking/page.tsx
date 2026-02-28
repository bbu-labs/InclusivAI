"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGetRanking } from "@/lib/api";
import type { ApiRanking } from "@/types";
import { IoShield, IoTrophy } from "react-icons/io5";

export default function RankingPage() {
  const [rankings, setRankings] = useState<ApiRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetRanking()
      .then(({ rankings }) => setRankings(rankings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
            Analisar Documento
          </Link>
        </div>
      </nav>

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
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base-content/50">Nenhuma empresa no ranking ainda.</p>
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
                    <th>Última Análise</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, i) => (
                    <tr key={r.id}>
                      <td className="font-bold">{i + 1}</td>
                      <td className="font-medium">{r.company_name}</td>
                      <td>
                        <span
                          className={`badge ${
                            r.avg_abuse_score >= 7
                              ? "badge-error"
                              : r.avg_abuse_score >= 4
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {r.avg_abuse_score.toFixed(1)}/10
                        </span>
                      </td>
                      <td>{r.total_analyses}</td>
                      <td className="text-xs text-base-content/50">
                        {new Date(r.last_analysis_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
