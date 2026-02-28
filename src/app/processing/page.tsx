"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/StepIndicator";
import {
  IoDocumentText,
  IoScan,
  IoColorWand,
  IoSearch,
  IoCheckmarkCircle,
  IoShield,
} from "react-icons/io5";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

const PROCESSING_STEPS = [
  {
    id: "extract",
    label: "Extraindo texto do documento...",
    icon: IoDocumentText,
    duration: 2000,
  },
  {
    id: "ocr",
    label: "Processando OCR (se necessário)...",
    icon: IoScan,
    duration: 1500,
  },
  {
    id: "clean",
    label: "Limpando e normalizando texto...",
    icon: IoColorWand,
    duration: 1500,
  },
  {
    id: "identify",
    label: "Identificando tipo de documento...",
    icon: IoSearch,
    duration: 2000,
  },
];

export default function ProcessingPage() {
  const router = useRouter();
  const { state, setExtractedText, setDocumentType } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!state.rawInput) {
      router.replace("/");
      return;
    }

    let stepIndex = 0;

    const processStep = () => {
      if (stepIndex >= PROCESSING_STEPS.length) {
        // Simulation: set mock extracted text and document type
        setExtractedText(
          "Texto extraído do documento simulado para demonstração do fluxo."
        );
        setDocumentType("contrato");
        router.push("/confirmation");
        return;
      }

      setCurrentStep(stepIndex);

      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
        processStep();
      }, PROCESSING_STEPS[stepIndex].duration);
    };

    processStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <span className="text-sm text-base-content/60">Processando...</span>
        </div>
      </nav>

      {/* ───── Main Content ───── */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={1} />

          <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center">
          {/* Spinner */}
          <div className="my-8">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-center">
            Analisando seu documento
          </h2>
          <p className="text-base-content/60 text-center mb-8 max-w-lg">
            Aguarde enquanto processamos o conteúdo...
          </p>

          {/* Processing steps */}
          <div className="w-full flex flex-col gap-4 bg-base-200 rounded-2xl p-6">
            {PROCESSING_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index && !isCompleted;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/30 shadow-sm"
                      : isCompleted
                      ? "bg-success/5 border border-success/20"
                      : "opacity-40"
                  }`}
                >
                  {isCompleted ? (
                    <IoCheckmarkCircle className="text-2xl text-success flex-shrink-0" />
                  ) : isCurrent ? (
                    <span className="loading loading-spinner loading-md text-primary flex-shrink-0" />
                  ) : (
                    <StepIcon className="text-2xl text-base-content/30 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-success"
                        : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full mt-8">
            <progress
              className="progress progress-primary w-full h-3"
              value={completedSteps.length}
              max={PROCESSING_STEPS.length}
            />
            <p className="text-sm text-center text-base-content/50 mt-3">
              {completedSteps.length} de {PROCESSING_STEPS.length} etapas concluídas
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
