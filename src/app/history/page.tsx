"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiListDocuments, apiDeleteDocument } from "@/lib/api";
import type { ApiDocument } from "@/types";
import { DOC_TYPE_LABELS, type DocType } from "@/types";
import {
  IoDocumentText,
  IoTrash,
  IoSearch,
} from "react-icons/io5";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/Toast";

export default function HistoryPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    apiListDocuments()
      .then(({ documents }) => setDocuments(documents))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;
    try {
      await apiDeleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast("Documento excluído", "success");
    } catch {
      showToast("Erro ao excluir documento", "error");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar
        rightAction={
          <Link href="/analyze" className="btn btn-primary btn-sm">
            Nova Análise
          </Link>
        }
      />

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-2">Meus Documentos</h1>
          <p className="text-base-content/60 mb-8">
            Documentos que você já analisou
          </p>

          {loading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card bg-base-200 flex-row items-center p-4 gap-4 animate-pulse">
                  <div className="w-8 h-8 bg-base-300 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-base-300 rounded w-1/2" />
                    <div className="h-3 bg-base-300 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <IoSearch className="text-4xl text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Nenhum documento ainda</h3>
              <p className="text-base-content/50 mb-6 max-w-sm mx-auto">
                Analise seu primeiro documento e ele aparecerá aqui.
              </p>
              <Link href="/analyze" className="btn btn-primary">
                Analisar agora
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="card bg-base-200 flex-row items-center p-4 gap-4"
                >
                  <IoDocumentText className="text-2xl text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-sm badge-outline">
                        {DOC_TYPE_LABELS[doc.doc_type as DocType] || doc.doc_type}
                      </span>
                      <span className="text-xs text-base-content/40">
                        {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => handleDelete(doc.id)}
                      aria-label="Excluir documento"
                    >
                      <IoTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
