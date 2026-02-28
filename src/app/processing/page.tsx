"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import AppShell from "@/components/AppShell";
import {
  IoDocumentText,
  IoScan,
  IoColorWand,
  IoSearch,
  IoCheckmarkCircle,
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
    <AppShell>
    <div className="flex flex-col min-h-screen">
      <Header title="Processando" />
      <StepIndicator steps={STEPS} currentStep={1} />

      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        {/* Spinner */}
        <div className="my-8">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>

        <h2 className="text-lg font-bold mb-2 text-center">
          Analisando seu documento
        </h2>
        <p className="text-sm text-base-content/60 text-center mb-8">
          Aguarde enquanto processamos o conteúdo...
        </p>

        {/* Processing steps */}
        <div className="w-full flex flex-col gap-3">
          {PROCESSING_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index && !isCompleted;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-primary/10 border border-primary/30"
                    : isCompleted
                    ? "bg-success/5"
                    : "opacity-40"
                }`}
              >
                {isCompleted ? (
                  <IoCheckmarkCircle className="text-xl text-success flex-shrink-0" />
                ) : isCurrent ? (
                  <span className="loading loading-spinner loading-sm text-primary flex-shrink-0" />
                ) : (
                  <StepIcon className="text-xl text-base-content/30 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    isCurrent
                      ? "font-semibold text-primary"
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
            className="progress progress-primary w-full"
            value={completedSteps.length}
            max={PROCESSING_STEPS.length}
          />
          <p className="text-xs text-center text-base-content/50 mt-2">
            {completedSteps.length} de {PROCESSING_STEPS.length} etapas
          </p>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
