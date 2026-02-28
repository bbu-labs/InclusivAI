"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import { IoLink, IoArrowForward } from "react-icons/io5";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

export default function UrlInputPage() {
  const router = useRouter();
  const { setRawInput } = useApp();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      setError("Por favor, insira uma URL.");
      return;
    }
    if (!validateUrl(url)) {
      setError("URL inválida. Insira uma URL completa (ex: https://exemplo.com).");
      return;
    }
    setError("");
    setRawInput(url);
    router.push("/processing");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Colar URL" showBack backTo="/" />
      <StepIndicator steps={STEPS} currentStep={0} />

      <div className="flex-1 px-6 py-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">Insira o link do documento</h2>
          <p className="text-sm text-base-content/60">
            Cole a URL de um documento público, termo de uso ou contrato online.
          </p>
        </div>

        <div className="form-control w-full">
          <label className="floating-label">
            <span>URL do documento</span>
            <input
              type="url"
              placeholder="https://exemplo.com/contrato.pdf"
              className={`input input-bordered w-full ${error ? "input-error" : ""}`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </label>
          {error && (
            <label className="label">
              <span className="label-text-alt text-error">{error}</span>
            </label>
          )}
        </div>

        {/* Examples */}
        <div className="mt-6">
          <p className="text-xs text-base-content/50 mb-2">Exemplos de URLs aceitas:</p>
          <div className="flex flex-col gap-2">
            {[
              "https://site.com/termos-de-uso",
              "https://empresa.com/contrato.pdf",
              "https://gov.br/regulamento",
            ].map((example) => (
              <button
                key={example}
                className="btn btn-ghost btn-sm justify-start text-xs normal-case text-primary"
                onClick={() => {
                  setUrl(example);
                  setError("");
                }}
              >
                <IoLink className="text-sm" />
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={!url.trim()}
          >
            Analisar documento
            <IoArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}
