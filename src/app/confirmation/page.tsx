"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import StepIndicator from "@/components/StepIndicator";
import { IoDocumentText, IoCheckmark, IoClose } from "react-icons/io5";
import { DOC_TYPE_LABELS, type DocType } from "@/types";
import Navbar from "@/components/Navbar";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

export default function ConfirmationPage() {
  const router = useRouter();
  const { state } = useApp();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!state.documentId || !state.document) {
      router.replace("/analyze");
    }
  }, [session, state.documentId, state.document, router]);

  const handleConfirm = () => {
    router.push("/results");
  };

  const handleReject = () => {
    router.push("/analyze");
  };

  if (!state.document) return null;

  const docType = state.document.doc_type as DocType;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar backHref="/analyze" backLabel="Voltar" />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={2} />

          <div className="mt-8 max-w-2xl mx-auto">
            {/* Document type card */}
            <div className="card bg-base-200 w-full mb-8 shadow-lg">
              <div className="card-body items-center text-center py-8">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <IoDocumentText className="text-5xl text-primary" />
                </div>
                <h2 className="card-title text-xl mb-2">Documento Identificado</h2>
                <div className="badge badge-primary badge-lg text-sm px-4 py-3">
                  {DOC_TYPE_LABELS[docType] || docType}
                </div>
                <p className="text-base-content/70 mt-4 text-lg font-medium">
                  {state.document.title}
                </p>
              </div>
            </div>

            {/* Confirmation question */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
              <p className="font-bold text-center text-lg mb-2">
                Este é realmente um documento do tipo{" "}
                <span className="text-primary">
                  {DOC_TYPE_LABELS[docType] || docType}
                </span>
                ?
              </p>
              <p className="text-sm text-base-content/60 text-center">
                A confirmação ajuda a IA a fazer uma análise mais precisa.
              </p>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                className="btn btn-outline btn-error btn-lg gap-2"
                onClick={handleReject}
              >
                <IoClose className="text-lg" />
                Não, voltar
              </button>
              <button
                className="btn btn-primary btn-lg gap-2"
                onClick={handleConfirm}
              >
                <IoCheckmark className="text-lg" />
                Sim, analisar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
