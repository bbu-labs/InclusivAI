"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import AppShell from "@/components/AppShell";
import {
  IoCloudUpload,
  IoDocument,
  IoArrowForward,
  IoClose,
  IoCheckmarkCircle,
} from "react-icons/io5";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function UploadPage() {
  const router = useRouter();
  const { setRawInput } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): boolean => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Formato não suportado. Use PDF, DOC, DOCX ou imagem.");
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. O limite é 10MB.");
      return false;
    }
    return true;
  };

  const handleFile = (f: File) => {
    setError("");
    if (validateFile(f)) {
      setFile(f);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawInput(event.target?.result as string, file.name);
      router.push("/processing");
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
    <div className="flex flex-col min-h-screen">
      <Header title="Enviar Arquivo" showBack backTo="/" />
      <StepIndicator steps={STEPS} currentStep={0} />

      <div className="flex-1 px-6 py-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">Envie seu documento</h2>
          <p className="text-sm text-base-content/60">
            Selecione um arquivo PDF, DOC, DOCX ou imagem (até 10MB).
          </p>
        </div>

        {!file ? (
          <>
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors min-h-48 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <IoCloudUpload className="text-5xl text-primary/60" />
              <div className="text-center">
                <p className="font-semibold text-sm">
                  Arraste ou clique para selecionar
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  PDF, DOC, DOCX, PNG, JPG
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {error && (
              <div className="alert alert-error mt-4">
                <span className="text-sm">{error}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {/* File preview */}
            <div className="bg-base-200 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <IoDocument className="text-2xl text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{file.name}</p>
                <p className="text-xs text-base-content/50">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-xl text-success" />
                <button
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => setFile(null)}
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
            </div>

            <div className="alert alert-info">
              <span className="text-xs">
                Arquivo válido e pronto para análise.
              </span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={!file}
          >
            Analisar documento
            <IoArrowForward />
          </button>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
