"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useExperience } from "@/contexts/ExperienceContext";
import StepIndicator from "@/components/StepIndicator";
import {
  IoLink,
  IoCamera,
  IoDocument,
  IoArrowForward,
  IoClose,
  IoImage,
  IoCloudUpload,
  IoCheckmarkCircle,
  IoAlert,
} from "react-icons/io5";
import Navbar from "@/components/Navbar";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

type AnalysisMode = "url" | "camera" | "upload";
type CameraMode = "choose" | "preview";

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

export default function AnalyzePage() {
  const router = useRouter();
  const { setRawInput, setInputMethod, reset } = useApp();
  const { session } = useAuth();
  const { profile: xp } = useExperience();
  const [selectedMode, setSelectedMode] = useState<AnalysisMode | null>(null);

  // URL state
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Camera state
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("choose");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateFile = (f: File): boolean => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setUploadError("Formato não suportado. Use PDF, DOC, DOCX ou imagem.");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setUploadError("Arquivo muito grande. O limite é 5MB.");
      return false;
    }
    return true;
  };

  const handleModeSelect = (mode: AnalysisMode) => {
    reset();
    setSelectedMode(mode);
    // Reset all states when switching modes
    setUrl("");
    setUrlError("");
    setPreview(null);
    setCameraMode("choose");
    setFile(null);
    setUploadError("");
  };

  const handleUrlSubmit = () => {
    if (!session) { router.push("/login"); return; }
    if (!url.trim()) {
      setUrlError("Por favor, insira uma URL.");
      return;
    }
    if (!validateUrl(url)) {
      setUrlError("URL inválida. Insira uma URL completa (ex: https://exemplo.com).");
      return;
    }
    setUrlError("");
    setInputMethod("url");
    setRawInput(url);
    router.push("/processing");
  };

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
      setCameraMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleCameraSubmit = () => {
    if (!session) { router.push("/login"); return; }
    if (preview) {
      setInputMethod("camera");
      setRawInput(preview, "foto_documento.jpg");
      router.push("/processing");
    }
  };

  const handleCameraClear = () => {
    setPreview(null);
    setCameraMode("choose");
  };

  const handleUploadFile = (f: File) => {
    setUploadError("");
    if (validateFile(f)) {
      setFile(f);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleUploadFile(droppedFile);
  }, []);

  const handleUploadSubmit = () => {
    if (!session) { router.push("/login"); return; }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputMethod("file");
      setRawInput(event.target?.result as string, file.name);
      router.push("/processing");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar backHref="/" backLabel="Início" />

      {/* ───── Main Content ───── */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={0} />

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Analisar Documento</h2>
              <p className="text-base-content/60 max-w-xl mx-auto">
                Escolha como enviar seu documento. Nossa IA fará o resto.
              </p>
            </div>

            {xp.showGuidanceText && (
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Dica: Escolha uma das opções abaixo. Se você tem um documento em papel, use &quot;Tirar Foto&quot;.</span>
              </div>
            )}

            {/* Mode Selection Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* URL Card */}
              <button
                className={`card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 text-left ${
                  selectedMode === "url"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => handleModeSelect("url")}
              >
                <div className="card-body items-center text-center py-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                    selectedMode === "url" ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    <IoLink className="text-3xl" />
                  </div>
                  <h3 className="card-title text-base">Colar URL</h3>
                  <p className="text-xs text-base-content/60">
                    Cole o link do documento
                  </p>
                </div>
              </button>

              {/* Camera Card */}
              <button
                className={`card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 text-left ${
                  selectedMode === "camera"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => handleModeSelect("camera")}
              >
                <div className="card-body items-center text-center py-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                    selectedMode === "camera" ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    <IoCamera className="text-3xl" />
                  </div>
                  <h3 className="card-title text-base">Tirar Foto</h3>
                  <p className="text-xs text-base-content/60">
                    Fotografe o documento
                  </p>
                </div>
              </button>

              {/* Upload Card */}
              <button
                className={`card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 text-left ${
                  selectedMode === "upload"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => handleModeSelect("upload")}
              >
                <div className="card-body items-center text-center py-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                    selectedMode === "upload" ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    <IoDocument className="text-3xl" />
                  </div>
                  <h3 className="card-title text-base">Enviar Arquivo</h3>
                  <p className="text-xs text-base-content/60">
                    PDF, imagem ou texto
                  </p>
                </div>
              </button>
            </div>

            {/* Dynamic Content Based on Selected Mode */}
            {selectedMode === "url" && (
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 w-full">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">URL do documento</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/termos-de-servico"
                    className={`input input-bordered input-lg w-full ${urlError ? "input-error" : ""}`}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  />
                  {urlError && (
                    <label className="label">
                      <span className="label-text-alt text-error">{urlError}</span>
                    </label>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    className="btn btn-primary btn-lg w-full gap-2"
                    onClick={handleUrlSubmit}
                    disabled={!url.trim()}
                  >
                    Analisar Agora
                    <IoArrowForward />
                  </button>
                </div>
              </div>
            )}

            {selectedMode === "camera" && (
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 w-full">
                {cameraMode === "choose" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Camera capture */}
                    <button
                      className="btn btn-outline btn-lg h-32 flex-col gap-2 hover:bg-primary hover:text-white"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <IoCamera className="text-4xl" />
                      <span className="text-sm">Abrir Câmera</span>
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
                      className="btn btn-outline btn-lg h-32 flex-col gap-2 hover:bg-secondary hover:text-white"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IoImage className="text-4xl" />
                      <span className="text-sm">Selecionar Arquivo</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <>
                    <div className="relative max-w-lg mx-auto mb-6">
                      <div className="relative overflow-hidden rounded-xl border border-base-300 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview!}
                          alt="Preview do documento"
                          className="w-full h-auto object-contain max-h-96"
                        />
                        <button
                          className="btn btn-circle btn-sm btn-error absolute top-3 right-3 shadow-lg"
                          onClick={handleCameraClear}
                          aria-label="Remover imagem"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <button className="btn btn-outline btn-lg" onClick={handleCameraClear}>
                        Tirar outra
                      </button>
                      <button className="btn btn-primary btn-lg gap-2" onClick={handleCameraSubmit}>
                        Analisar Agora
                        <IoArrowForward />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedMode === "upload" && (
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 w-full">
                {!file ? (
                  <>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? "border-primary bg-primary/5 scale-105"
                          : "border-base-300 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onClick={() => uploadInputRef.current?.click()}
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
                          Arraste o arquivo aqui
                        </p>
                        <p className="text-sm text-base-content/60">
                          ou clique para selecionar
                        </p>
                      </div>
                      <button className="btn btn-primary btn-lg">
                        Selecionar Arquivo
                      </button>
                    </div>

                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept={ACCEPTED_EXTENSIONS}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadFile(f);
                      }}
                    />

                    {uploadError && (
                      <div className="alert alert-error mt-4">
                        <IoAlert className="text-lg" />
                        <span className="text-sm">{uploadError}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm mb-6">
                      <div className="bg-success/10 rounded-xl p-4">
                        <IoDocument className="text-3xl text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate">{file.name}</p>
                        <p className="text-sm text-base-content/60">
                          {formatFileSize(file.size)} &bull; Arquivo válido
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <IoCheckmarkCircle className="text-2xl text-success" />
                        <button
                          className="btn btn-ghost btn-circle"
                          onClick={() => setFile(null)}
                          aria-label="Remover arquivo"
                        >
                          <IoClose className="text-lg" />
                        </button>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-lg w-full gap-2"
                      onClick={handleUploadSubmit}
                    >
                      Analisar Agora
                      <IoArrowForward />
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedMode && (
              <p className="text-center text-xs text-base-content/40 mt-6">
                Seus documentos são processados com segurança e não são armazenados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
