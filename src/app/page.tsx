"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { IoLink, IoCamera, IoDocument } from "react-icons/io5";

export default function Home() {
  const router = useRouter();
  const { setInputMethod, reset } = useApp();

  const handleSelect = (method: "url" | "camera" | "file") => {
    reset();
    setInputMethod(method);
    router.push(`/${method === "url" ? "url-input" : method === "camera" ? "camera" : "upload"}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-secondary text-primary-content px-6 pt-12 pb-10 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-3xl font-extrabold mb-2">Cláusula Oculta</h1>
        <p className="text-sm opacity-90 max-w-xs mx-auto">
          Transformamos documentos jurídicos e contratuais em linguagem simples
          e acessível para você.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <h2 className="text-lg font-bold text-base-content mb-1">
          Como deseja enviar seu documento?
        </h2>
        <p className="text-sm text-base-content/60 mb-6">
          Escolha uma das opções abaixo para começar a análise.
        </p>

        <div className="flex flex-col gap-4">
          {/* URL */}
          <button
            className="btn btn-outline btn-lg justify-start gap-4 h-auto py-4 normal-case"
            onClick={() => handleSelect("url")}
          >
            <div className="bg-primary/10 rounded-xl p-3">
              <IoLink className="text-2xl text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Colar URL</div>
              <div className="text-xs text-base-content/60 font-normal">
                Cole o link de um documento online
              </div>
            </div>
          </button>

          {/* Camera */}
          <button
            className="btn btn-outline btn-lg justify-start gap-4 h-auto py-4 normal-case"
            onClick={() => handleSelect("camera")}
          >
            <div className="bg-secondary/10 rounded-xl p-3">
              <IoCamera className="text-2xl text-secondary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Câmera / Foto</div>
              <div className="text-xs text-base-content/60 font-normal">
                Tire uma foto ou escolha da galeria
              </div>
            </div>
          </button>

          {/* File Upload */}
          <button
            className="btn btn-outline btn-lg justify-start gap-4 h-auto py-4 normal-case"
            onClick={() => handleSelect("file")}
          >
            <div className="bg-accent/10 rounded-xl p-3">
              <IoDocument className="text-2xl text-accent" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Enviar Arquivo</div>
              <div className="text-xs text-base-content/60 font-normal">
                PDF, DOC, DOCX ou imagem do documento
              </div>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-xs text-base-content/40">
            Seus documentos são processados com segurança e não são armazenados.
          </p>
        </div>
      </div>
    </div>
  );
}
