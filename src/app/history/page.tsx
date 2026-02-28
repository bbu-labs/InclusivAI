"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiListDocuments, apiDeleteDocument } from "@/lib/api";
import type { ApiDocument } from "@/types";
import { DOC_TYPE_LABELS, type DocType } from "@/types";
import {
  IoShield,
  IoDocumentText,
  IoTrash,
  IoRefresh,
} from "react-icons/io5";

export default function HistoryPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
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
    } catch {
      alert("Erro ao excluir documento");
    }
  };

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
          <h1 className="text-3xl font-extrabold mb-2">Meus Documentos</h1>
          <p className="text-base-content/60 mb-8">
            Documentos que você já analisou
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <IoDocumentText className="text-6xl text-base-content/20 mx-auto mb-4" />
              <p className="text-base-content/50 mb-4">
                Você ainda não analisou nenhum documento.
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
                      title="Excluir"
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
