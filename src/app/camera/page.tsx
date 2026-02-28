"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import AppShell from "@/components/AppShell";
import { IoCamera, IoImage, IoArrowForward, IoClose } from "react-icons/io5";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

export default function CameraPage() {
  const router = useRouter();
  const { setRawInput } = useApp();
  const [preview, setPreview] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<"choose" | "preview">("choose");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setCaptureMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (preview) {
      setRawInput(preview, "foto_documento.jpg");
      router.push("/processing");
    }
  };

  const handleClear = () => {
    setPreview(null);
    setCaptureMode("choose");
  };

  return (
    <AppShell>
    <div className="flex flex-col min-h-screen">
      <Header title="Câmera / Foto" showBack backTo="/" />
      <StepIndicator steps={STEPS} currentStep={0} />

      <div className="flex-1 px-6 py-6 flex flex-col">
        {captureMode === "choose" ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-1">Capture o documento</h2>
              <p className="text-sm text-base-content/60">
                Tire uma foto do documento ou escolha uma imagem da sua galeria.
              </p>
            </div>

            <div className="flex flex-col gap-4 flex-1 justify-center">
              {/* Camera capture */}
              <button
                className="btn btn-outline btn-lg h-32 flex-col gap-2"
                onClick={() => cameraInputRef.current?.click()}
              >
                <IoCamera className="text-4xl text-primary" />
                <span className="text-sm">Tirar Foto</span>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="divider text-xs text-base-content/40">OU</div>

              {/* Gallery */}
              <button
                className="btn btn-outline btn-lg h-32 flex-col gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <IoImage className="text-4xl text-secondary" />
                <span className="text-sm">Escolher da Galeria</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Tips */}
            <div className="mt-6 bg-base-200 rounded-xl p-4">
              <p className="text-xs font-semibold mb-2">Dicas para uma boa captura:</p>
              <ul className="text-xs text-base-content/60 space-y-1">
                <li>- Boa iluminação, sem sombras</li>
                <li>- Documento centralizado e reto</li>
                <li>- Texto legível e em foco</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-1">Confira a imagem</h2>
              <p className="text-sm text-base-content/60">
                Verifique se o texto está legível antes de prosseguir.
              </p>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <div className="relative w-full max-h-96 overflow-hidden rounded-xl border border-base-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview!}
                  alt="Preview do documento"
                  className="w-full h-auto object-contain"
                />
                <button
                  className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                  onClick={handleClear}
                >
                  <IoClose />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="btn btn-outline flex-1" onClick={handleClear}>
                Tirar outra
              </button>
              <button className="btn btn-primary flex-1" onClick={handleSubmit}>
                Analisar
                <IoArrowForward />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </AppShell>
  );
}
