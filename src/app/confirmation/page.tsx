"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/StepIndicator";
import { IoDocumentText, IoCheckmark, IoClose, IoShield } from "react-icons/io5";

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
    <div className="min-h-screen bg-base-100">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <IoShield className="w-5 h-5 text-black" />
            </div>
            Cláusula Oculta
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-base-200 text-base-content font-semibold text-sm rounded-lg hover:bg-base-300 transition-colors"
          >
            Voltar
          </button>
        </div>
      </nav>

      {/* ───── Main Content ───── */}
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
                {DOCUMENT_TYPE_LABELS[state.documentType]}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-8">
            <h3 className="font-bold mb-4 text-lg">Prévia do texto extraído:</h3>
            <div className="bg-base-200 rounded-2xl p-6 max-h-60 overflow-y-auto">
              <p className="text-sm text-base-content/70 leading-relaxed">
                {state.extractedText?.slice(0, 500)}
                {(state.extractedText?.length ?? 0) > 500 && "..."}
              </p>
            </div>
          </div>

          {/* Confirmation question */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
            <p className="font-bold text-center text-lg mb-2">
              Este é realmente um documento do tipo{" "}
              <span className="text-primary">
                {DOCUMENT_TYPE_LABELS[state.documentType]}
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
