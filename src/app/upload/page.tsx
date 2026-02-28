"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import {
  IoCloudUpload,
  IoDocument,
  IoArrowForward,
  IoClose,
  IoCheckmarkCircle,
  IoAlert,
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
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Header title="Enviar Arquivo" showBack backTo="/" />
        <StepIndicator steps={STEPS} currentStep={0} />

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Envie seu documento</h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Selecione um arquivo PDF, DOC, DOCX ou imagem (até 10MB).
            </p>
          </div>

          {!file ? (
            <>
              {/* Drop zone */}
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 mb-6">
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-base-300 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                    <IoCloudUpload className="text-4xl text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg mb-2">
                      Arraste ou clique para selecionar
                    </p>
                    <p className="text-sm text-base-content/60">
                      PDF, DOC, DOCX, PNG, JPG (até 10MB)
                    </p>
                  </div>
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
                <div className="alert alert-error">
                  <IoAlert className="text-lg" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </>
          ) : (
            <div className="bg-base-200 rounded-2xl p-6">
              {/* File preview */}
              <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
                <div className="bg-success/10 rounded-xl p-4">
                  <IoDocument className="text-3xl text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">{file.name}</p>
                  <p className="text-sm text-base-content/60">
                    {formatFileSize(file.size)} • Arquivo válido
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <IoCheckmarkCircle className="text-2xl text-success" />
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => setFile(null)}
                  >
                    <IoClose className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-xl">
                <p className="text-sm text-success flex items-center gap-2">
                  <IoCheckmarkCircle className="text-lg" />
                  Arquivo pronto para análise
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={handleSubmit}
              disabled={!file}
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
