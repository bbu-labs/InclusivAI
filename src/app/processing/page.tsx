"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiUploadFile, apiCreateTextDocument, ApiError } from "@/lib/api";
import StepIndicator from "@/components/StepIndicator";
import {
  IoDocumentText,
  IoScan,
  IoColorWand,
  IoSearch,
  IoCheckmarkCircle,
  IoRefresh,
} from "react-icons/io5";
import Navbar from "@/components/Navbar";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

const PROCESSING_STEPS = [
  { id: "upload", label: "Enviando documento...", icon: IoDocumentText },
  { id: "extract", label: "Extraindo texto do documento...", icon: IoScan },
  { id: "clean", label: "Processando conteúdo...", icon: IoColorWand },
  { id: "identify", label: "Identificando tipo de documento...", icon: IoSearch },
];

function dataUrlToFile(dataUrl: string, fileName: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], fileName, { type: mime });
}

export default function ProcessingPage() {
  const router = useRouter();
  const { state, setDocument } = useApp();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!state.rawInput) {
      router.replace("/analyze");
      return;
    }
    if (!session) {
      router.replace("/login");
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;

    const advanceStep = (step: number) => {
      setCurrentStep(step);
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step]);
      }, 800);
    };

    const processDocument = async () => {
      try {
        advanceStep(0);

        let result: { document: import("@/types").ApiDocument };

        if (state.inputMethod === "file" || state.inputMethod === "camera") {
          // Convert base64 data URL to File
          const file = dataUrlToFile(
            state.rawInput!,
            state.fileName || "documento"
          );
          result = await apiUploadFile(file);
        } else {
          // URL or text input
          result = await apiCreateTextDocument(
            state.rawInput!.slice(0, 100),
            state.rawInput!
          );
        }

        advanceStep(1);
        await new Promise((r) => setTimeout(r, 600));
        advanceStep(2);
        await new Promise((r) => setTimeout(r, 600));
        advanceStep(3);
        await new Promise((r) => setTimeout(r, 600));

        setDocument(result.document);
        router.push("/confirmation");
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Erro ao processar documento. Tente novamente.");
        }
      }
    };

    processDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    hasStarted.current = false;
    router.replace("/analyze");
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar statusText="Processando..." hideUserMenu />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={1} />

          <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center">
            {error ? (
              <>
                <div className="alert alert-error mb-6 w-full">
                  <span>{error}</span>
                </div>
                <button className="btn btn-primary btn-lg gap-2" onClick={handleRetry}>
                  <IoRefresh className="text-lg" />
                  Tentar novamente
                </button>
              </>
            ) : (
              <>
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
                    {completedSteps.length} de {PROCESSING_STEPS.length} etapas
                    concluídas
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
