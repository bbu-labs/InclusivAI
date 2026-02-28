"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
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
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Header title="Câmera / Foto" showBack backTo="/" />
        <StepIndicator steps={STEPS} currentStep={0} />

        <div className="mt-8 max-w-2xl mx-auto">
          {captureMode === "choose" ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Capture o documento</h2>
                <p className="text-base-content/60 max-w-xl mx-auto">
                  Tire uma foto do documento ou escolha uma imagem da sua galeria.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Camera capture */}
                <button
                  className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-300"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <div className="card-body items-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <IoCamera className="text-3xl text-primary" />
                    </div>
                    <h3 className="card-title text-lg">Tirar Foto</h3>
                    <p className="text-sm text-base-content/60">
                      Use a câmera do seu dispositivo
                    </p>
                  </div>
                </button>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Gallery */}
                <button
                  className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="card-body items-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                      <IoImage className="text-3xl text-secondary" />
                    </div>
                    <h3 className="card-title text-lg">Escolher da Galeria</h3>
                    <p className="text-sm text-base-content/60">
                      Selecione uma foto existente
                    </p>
                  </div>
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
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <IoCamera className="text-lg" />
                  Dicas para uma boa captura
                </h3>
                <ul className="text-sm text-base-content/70 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Boa iluminação, sem sombras sobre o texto
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Documento centralizado e reto na foto
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Texto legível e em foco
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Confira a imagem</h2>
                <p className="text-base-content/60 max-w-xl mx-auto">
                  Verifique se o texto está legível antes de prosseguir.
                </p>
              </div>

              <div className="bg-base-200 rounded-2xl p-6 mb-6">
                <div className="relative max-w-lg mx-auto">
                  <div className="relative overflow-hidden rounded-xl border border-base-300 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview!}
                      alt="Preview do documento"
                      className="w-full h-auto object-contain max-h-96"
                    />
                    <button
                      className="btn btn-circle btn-sm btn-error absolute top-3 right-3 shadow-lg"
                      onClick={handleClear}
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button className="btn btn-outline btn-lg" onClick={handleClear}>
                  Tirar outra
                </button>
                <button className="btn btn-primary btn-lg gap-2" onClick={handleSubmit}>
                  Analisar documento
                  <IoArrowForward />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
