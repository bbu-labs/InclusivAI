"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import {
  IoLink,
  IoCamera,
  IoDocument,
  IoShieldCheckmark,
  IoFlash,
  IoDocumentText,
  IoScan,
  IoArrowForward,
  IoCheckmarkCircle,
  IoLockClosed,
  IoEye,
} from "react-icons/io5";

export default function Home() {
  const router = useRouter();
  const { setInputMethod, reset } = useApp();

  const handleSelect = (method: "url" | "camera" | "file") => {
    reset();
    setInputMethod(method);
    router.push(
      `/${method === "url" ? "url-input" : method === "camera" ? "camera" : "upload"}`
    );
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full bg-base-100/80 backdrop-blur-md z-50 border-b border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cláusula Oculta
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-base-content/70">
            <button onClick={() => scrollTo("features")} className="hover:text-primary transition-colors">
              Funcionalidades
            </button>
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-primary transition-colors">
              Como Funciona
            </button>
            <button onClick={() => scrollTo("protection")} className="hover:text-primary transition-colors">
              Proteção
            </button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => scrollTo("get-started")}>
            Começar Agora
          </button>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <IoShieldCheckmark />
              Proteção ao consumidor com IA
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-base-content leading-tight mb-6">
              Entenda seus{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                contratos
              </span>{" "}
              em linguagem simples
            </h1>

            <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              IA que transforma documentos jurídicos e contratuais em texto
              acessível, identifica cláusulas abusivas e protege seus direitos
              como consumidor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg gap-2" onClick={() => scrollTo("get-started")}>
                Analisar Documento
                <IoArrowForward />
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => scrollTo("how-it-works")}>
                Como Funciona
              </button>
            </div>
          </div>

          {/* Mockup preview card */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-base-content/40 ml-2">
                  análise em andamento...
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <span className="badge badge-error badge-sm">Alto</span>
                  <span className="text-sm font-medium flex-1">Multa rescisória de 40%</span>
                  <span className="text-xs text-error hidden sm:inline">Art. 51 CDC</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <span className="badge badge-error badge-sm">Alto</span>
                  <span className="text-sm font-medium flex-1">Dados compartilhados sem consentimento</span>
                  <span className="text-xs text-error hidden sm:inline">LGPD</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <span className="badge badge-warning badge-sm">Médio</span>
                  <span className="text-sm font-medium flex-1">Reajuste unilateral de preços</span>
                  <span className="text-xs text-warning hidden sm:inline">Art. 51 CDC</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <span className="badge badge-success badge-sm">Baixo</span>
                  <span className="text-sm font-medium flex-1">Foro de resolução</span>
                  <span className="text-xs text-success hidden sm:inline">Art. 101 CDC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-20 px-6 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Tudo que você precisa para entender seus documentos
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              Nossa IA analisa cada detalhe do seu documento, simplifica a
              linguagem e identifica o que realmente importa para você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <IoFlash className="text-2xl text-primary" />
                </div>
                <h3 className="card-title text-lg">Linguagem Simples</h3>
                <p className="text-sm text-base-content/60">
                  Traduz juridiquês complexo em texto claro e fácil de entender
                  para qualquer pessoa.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-2">
                  <IoShieldCheckmark className="text-2xl text-error" />
                </div>
                <h3 className="card-title text-lg">Detecta Cláusulas Abusivas</h3>
                <p className="text-sm text-base-content/60">
                  Identifica automaticamente termos que violam o Código de Defesa
                  do Consumidor.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-2">
                  <IoDocumentText className="text-2xl text-warning" />
                </div>
                <h3 className="card-title text-lg">Referências Legais</h3>
                <p className="text-sm text-base-content/60">
                  Cada cláusula vem com referência ao artigo do CDC ou LGPD
                  correspondente.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                  <IoScan className="text-2xl text-secondary" />
                </div>
                <h3 className="card-title text-lg">OCR Inteligente</h3>
                <p className="text-sm text-base-content/60">
                  Extrai texto de fotos e imagens de documentos com alta
                  precisão.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                  <IoLockClosed className="text-2xl text-success" />
                </div>
                <h3 className="card-title text-lg">Privacidade Total</h3>
                <p className="text-sm text-base-content/60">
                  Seus documentos são processados com segurança e nunca são
                  armazenados.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <IoEye className="text-2xl text-accent" />
                </div>
                <h3 className="card-title text-lg">Score de Risco</h3>
                <p className="text-sm text-base-content/60">
                  Avaliação visual de 0 a 100 mostrando o nível geral de risco
                  do documento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Como Funciona
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Em apenas três passos simples, tenha total clareza sobre qualquer
              documento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <IoDocument className="text-3xl text-white" />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-base-100 shadow-lg border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  01
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Envie seu documento</h3>
              <p className="text-sm text-base-content/60 max-w-xs mx-auto">
                Cole uma URL, tire uma foto ou faça upload de um arquivo PDF,
                DOC ou imagem.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <IoScan className="text-3xl text-white" />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-base-100 shadow-lg border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  02
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">IA analisa tudo</h3>
              <p className="text-sm text-base-content/60 max-w-xs mx-auto">
                Nossa IA extrai o texto, identifica cada cláusula e verifica
                conformidade legal.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <IoCheckmarkCircle className="text-3xl text-white" />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-base-100 shadow-lg border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  03
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Resultado claro</h3>
              <p className="text-sm text-base-content/60 max-w-xs mx-auto">
                Receba um relatório com linguagem simples, score de risco e
                recomendações práticas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats / Protection ───── */}
      <section id="protection" className="py-20 px-6 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Proteção que faz diferença
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Baseado no Código de Defesa do Consumidor e na LGPD, garantindo
              que seus direitos sejam respeitados.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">50+</div>
              <p className="text-sm text-white/70">Artigos do CDC verificados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">100%</div>
              <p className="text-sm text-white/70">Privacidade dos dados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">3</div>
              <p className="text-sm text-white/70">Formas de envio</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">&lt;30s</div>
              <p className="text-sm text-white/70">Tempo de análise</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Get Started / CTA ───── */}
      <section id="get-started" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Comece a analisar agora
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Escolha como deseja enviar seu documento e receba uma análise
              completa em segundos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* URL */}
            <button
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={() => handleSelect("url")}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                  <IoLink className="text-3xl text-primary" />
                </div>
                <h3 className="card-title text-lg">Colar URL</h3>
                <p className="text-sm text-base-content/60">
                  Cole o link de um documento, termo de uso ou contrato online.
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-primary btn-sm gap-1">
                    Começar <IoArrowForward />
                  </span>
                </div>
              </div>
            </button>

            {/* Camera */}
            <button
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={() => handleSelect("camera")}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
                  <IoCamera className="text-3xl text-secondary" />
                </div>
                <h3 className="card-title text-lg">Câmera / Foto</h3>
                <p className="text-sm text-base-content/60">
                  Tire uma foto do documento ou escolha uma imagem da galeria.
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-secondary btn-sm gap-1">
                    Começar <IoArrowForward />
                  </span>
                </div>
              </div>
            </button>

            {/* Upload */}
            <button
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={() => handleSelect("file")}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
                  <IoDocument className="text-3xl text-accent" />
                </div>
                <h3 className="card-title text-lg">Enviar Arquivo</h3>
                <p className="text-sm text-base-content/60">
                  Upload de PDF, DOC, DOCX ou imagem do documento (até 10MB).
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-accent btn-sm gap-1">
                    Começar <IoArrowForward />
                  </span>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-base-content/40 mt-8">
            Seus documentos são processados com segurança e não são armazenados
            em nossos servidores.
          </p>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-12 px-6 bg-base-200 border-t border-base-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <span className="font-bold text-lg">Cláusula Oculta</span>
              <span className="text-xs text-base-content/40 ml-2">by InclusivAI</span>
            </div>
            <p className="text-sm text-base-content/50">
              © 2026 InclusivAI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
