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
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Header title="Colar URL" showBack backTo="/" />
        <StepIndicator steps={STEPS} currentStep={0} />

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Insira o link do documento</h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Cole a URL de um documento público, termo de uso ou contrato online.
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-6 md:p-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">URL do documento</span>
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/contrato.pdf"
                className={`input input-bordered input-lg w-full ${error ? "input-error" : ""}`}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {error && (
                <label className="label">
                  <span className="label-text-alt text-error">{error}</span>
                </label>
              )}
            </div>

            {/* Examples */}
            <div className="mt-6">
              <p className="text-sm text-base-content/60 mb-3">Exemplos de URLs aceitas:</p>
              <div className="grid gap-2">
                {[
                  "https://site.com/termos-de-uso",
                  "https://empresa.com/contrato.pdf",
                  "https://gov.br/regulamento",
                ].map((example) => (
                  <button
                    key={example}
                    className="btn btn-ghost btn-sm justify-start normal-case text-primary hover:bg-primary/10"
                    onClick={() => {
                      setUrl(example);
                      setError("");
                    }}
                  >
                    <IoLink className="text-base" />
                    <span className="text-sm">{example}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={handleSubmit}
              disabled={!url.trim()}
            >
              Analisar documento
              <IoArrowForward />
            </button>
            <p className="text-center text-xs text-base-content/40 mt-4">
              Seus documentos são processados com segurança e não são armazenados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
