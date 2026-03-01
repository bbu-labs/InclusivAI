"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useExperience } from "@/contexts/ExperienceContext";
import StepIndicator from "@/components/StepIndicator";
import {
  IoLink,
  IoCamera,
  IoDocument,
  IoDocumentText,
  IoArrowForward,
  IoClose,
  IoImage,
  IoCloudUpload,
  IoCheckmarkCircle,
  IoAlert,
  IoMic,
  IoStop,
  IoTrash,
} from "react-icons/io5";
import Navbar from "@/components/Navbar";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

type AnalysisMode = "url" | "camera" | "upload" | "text" | "audio";
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

const TEXT_MIN_LENGTH = 200;
const TEXT_MAX_LENGTH = 100000;
const MAX_RECORDING_SECONDS = 300;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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

  // Text paste state
  const [pastedText, setPastedText] = useState("");
  const [textError, setTextError] = useState("");

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Stop any active recording before switching
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
    }

    reset();
    setSelectedMode(mode);
    // Reset all states when switching modes
    setUrl("");
    setUrlError("");
    setPreview(null);
    setCameraMode("choose");
    setFile(null);
    setUploadError("");
    setPastedText("");
    setTextError("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioError("");
    setRecordingTime(0);
  };

  // ─── URL handlers ───
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

  // ─── Camera handlers ───
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

  // ─── Upload handlers ───
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

  // ─── Text paste handlers ───
  const handleTextSubmit = () => {
    if (!session) { router.push("/login"); return; }
    if (pastedText.length < TEXT_MIN_LENGTH) {
      setTextError(`O texto deve ter no mínimo ${TEXT_MIN_LENGTH} caracteres para análise.`);
      return;
    }
    setTextError("");
    setInputMethod("text");
    setRawInput(pastedText);
    router.push("/processing");
  };

  // ─── Audio recording handlers ───
  const startRecording = async () => {
    setAudioError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) {
            // Auto-stop at max
            mediaRecorder.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setAudioError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const clearRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
    setAudioError("");
  };

  const handleAudioSubmit = () => {
    if (!session) { router.push("/login"); return; }
    if (!audioBlob) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputMethod("audio");
      setRawInput(event.target?.result as string, "gravacao_audio.webm");
      router.push("/processing");
    };
    reader.readAsDataURL(audioBlob);
  };

  // ─── Card component ───
  const ModeCard = ({
    mode,
    icon: Icon,
    title,
    subtitle,
  }: {
    mode: AnalysisMode;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
  }) => (
    <button
      className={`card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 text-left ${
        selectedMode === mode
          ? "border-primary bg-primary/5"
          : "border-base-300 bg-base-100"
      }`}
      onClick={() => handleModeSelect(mode)}
    >
      <div className="card-body items-center text-center py-8">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
          selectedMode === mode ? "bg-primary text-white" : "bg-primary/10 text-primary"
        }`}>
          <Icon className="text-3xl" />
        </div>
        <h3 className="card-title text-base">{title}</h3>
        <p className="text-xs text-base-content/60">{subtitle}</p>
      </div>
    </button>
  );

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
                Envie um documento para análise. Cole o texto, envie um arquivo, use a câmera ou grave um áudio.
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

            {/* Mode Selection Cards — Row 1 */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <ModeCard mode="url" icon={IoLink} title="Colar URL" subtitle="Cole o link do documento" />
              <ModeCard mode="text" icon={IoDocumentText} title="Colar Texto" subtitle="Cole o texto completo do documento" />
              <ModeCard mode="upload" icon={IoDocument} title="Enviar Arquivo" subtitle="PDF, imagem ou texto" />
            </div>

            {/* Mode Selection Cards — Row 2 */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <ModeCard mode="camera" icon={IoCamera} title="Tirar Foto" subtitle="Fotografe o documento" />
              <ModeCard mode="audio" icon={IoMic} title="Gravar Áudio" subtitle="Leia ou descreva o documento" />
            </div>

            {/* Dynamic Content Based on Selected Mode */}

            {/* ─── URL Panel ─── */}
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

            {/* ─── Text Panel ─── */}
            {selectedMode === "text" && (
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 w-full">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Texto do documento</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered h-48 w-full text-base leading-relaxed ${
                      textError ? "textarea-error" : ""
                    }`}
                    placeholder="Cole aqui o texto completo do documento que deseja analisar..."
                    value={pastedText}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, TEXT_MAX_LENGTH);
                      setPastedText(val);
                      if (textError) setTextError("");
                    }}
                    maxLength={TEXT_MAX_LENGTH}
                  />
                  <label className="label">
                    <span
                      className={`label-text-alt ${
                        pastedText.length >= TEXT_MIN_LENGTH
                          ? "text-success"
                          : pastedText.length > 0
                          ? "text-warning"
                          : "text-base-content/50"
                      }`}
                    >
                      {pastedText.length} / {TEXT_MIN_LENGTH} caracteres mínimos
                    </span>
                  </label>
                  {textError && (
                    <label className="label pt-0">
                      <span className="label-text-alt text-error">{textError}</span>
                    </label>
                  )}
                </div>

                <div className="alert alert-warning mt-4">
                  <IoAlert className="text-lg shrink-0" />
                  <span className="text-sm">
                    Cole o texto completo do documento. Este recurso é para análise de documentos, não para perguntas ou consultas rápidas.
                  </span>
                </div>

                <div className="mt-6">
                  <button
                    className="btn btn-primary btn-lg w-full gap-2"
                    onClick={handleTextSubmit}
                    disabled={pastedText.length < TEXT_MIN_LENGTH}
                  >
                    Analisar Agora
                    <IoArrowForward />
                  </button>
                </div>
              </div>
            )}

            {/* ─── Camera Panel ─── */}
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

            {/* ─── Upload Panel ─── */}
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

            {/* ─── Audio Panel ─── */}
            {selectedMode === "audio" && (
              <div className="bg-base-200 rounded-2xl p-6 md:p-8 w-full">
                {!audioBlob ? (
                  <div className="flex flex-col items-center gap-6">
                    {/* Mic icon */}
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? "bg-error/20 animate-pulse"
                          : "bg-primary/10"
                      }`}
                    >
                      <IoMic className={`text-6xl ${isRecording ? "text-error" : "text-primary"}`} />
                    </div>

                    {/* Timer */}
                    <p className={`text-3xl font-mono font-bold ${isRecording ? "text-error" : "text-base-content/40"}`}>
                      {formatTime(recordingTime)}
                    </p>

                    {/* Instructions */}
                    <p className="text-sm text-base-content/60 text-center max-w-md">
                      Leia o documento em voz alta ou descreva seu conteúdo.
                    </p>

                    {/* Start/Stop button */}
                    {!isRecording ? (
                      <button
                        className="btn btn-primary btn-lg gap-2"
                        onClick={startRecording}
                      >
                        <IoMic className="text-xl" />
                        Iniciar Gravação
                      </button>
                    ) : (
                      <button
                        className="btn btn-error btn-lg gap-2"
                        onClick={stopRecording}
                      >
                        <IoStop className="text-xl" />
                        Parar Gravação
                      </button>
                    )}

                    {audioError && (
                      <div className="alert alert-error w-full">
                        <IoAlert className="text-lg shrink-0" />
                        <span className="text-sm">{audioError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    {/* Success card */}
                    <div className="bg-success/10 border border-success/30 rounded-xl p-6 w-full flex items-center gap-4">
                      <IoCheckmarkCircle className="text-3xl text-success shrink-0" />
                      <div>
                        <p className="font-bold">Gravação concluída</p>
                        <p className="text-sm text-base-content/60">
                          Duração: {formatTime(recordingTime)}
                        </p>
                      </div>
                    </div>

                    {/* Audio playback */}
                    {audioUrl && (
                      <audio controls className="w-full" src={audioUrl} />
                    )}

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <button
                        className="btn btn-outline btn-lg gap-2"
                        onClick={clearRecording}
                      >
                        <IoTrash className="text-lg" />
                        Gravar novamente
                      </button>
                      <button
                        className="btn btn-primary btn-lg gap-2"
                        onClick={handleAudioSubmit}
                      >
                        Analisar Agora
                        <IoArrowForward />
                      </button>
                    </div>
                  </div>
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
