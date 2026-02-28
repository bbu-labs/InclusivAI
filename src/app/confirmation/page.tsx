"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import AppShell from "@/components/AppShell";
import { IoDocumentText, IoCheckmark, IoClose } from "react-icons/io5";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  contrato: "Contrato",
  termo_de_uso: "Termo de Uso",
  politica_privacidade: "Política de Privacidade",
  regulamento: "Regulamento",
  outro: "Outro Documento",
};

export default function ConfirmationPage() {
  const router = useRouter();
  const { state, confirmDocument } = useApp();

  useEffect(() => {
    if (!state.extractedText) {
      router.replace("/");
    }
  }, [state.extractedText, router]);

  const handleConfirm = () => {
    confirmDocument();
    router.push("/results");
  };

  const handleReject = () => {
    router.push("/");
  };

  if (!state.documentType) return null;

  return (
    <AppShell>
    <div className="flex flex-col min-h-screen">
      <Header title="Confirmação" showBack />
      <StepIndicator steps={STEPS} currentStep={2} />

      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        {/* Document type card */}
        <div className="card bg-base-200 w-full mb-6">
          <div className="card-body items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-2">
              <IoDocumentText className="text-4xl text-primary" />
            </div>
            <h2 className="card-title text-lg">Documento Identificado</h2>
            <div className="badge badge-primary badge-lg mt-2">
              {DOCUMENT_TYPE_LABELS[state.documentType]}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="w-full mb-6">
          <h3 className="text-sm font-semibold mb-2">Prévia do texto extraído:</h3>
          <div className="bg-base-200 rounded-xl p-4 max-h-40 overflow-y-auto">
            <p className="text-xs text-base-content/70 leading-relaxed">
              {state.extractedText?.slice(0, 500)}
              {(state.extractedText?.length ?? 0) > 500 && "..."}
            </p>
          </div>
        </div>

        {/* Confirmation question */}
        <div className="w-full bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-center">
            Este é realmente um documento do tipo{" "}
            <span className="text-primary">
              {DOCUMENT_TYPE_LABELS[state.documentType]}
            </span>
            ?
          </p>
          <p className="text-xs text-base-content/60 text-center mt-1">
            A confirmação ajuda a IA a fazer uma análise mais precisa.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex gap-3 mt-auto">
          <button
            className="btn btn-outline btn-error flex-1"
            onClick={handleReject}
          >
            <IoClose className="text-lg" />
            Não, voltar
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleConfirm}
          >
            <IoCheckmark className="text-lg" />
            Sim, analisar
          </button>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
