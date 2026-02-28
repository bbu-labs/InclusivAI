"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
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
  IoShareSocial,
  IoPerson,
  IoBag,
  IoPencil,
  IoBuild,
  IoPeople,
  IoShield,
} from "react-icons/io5";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { reset } = useApp();
  const { session, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = () => {
    reset();
    router.push("/analyze");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const profiles = [
  {
    icon: <IoPerson className="w-5 h-5" />,
    title: "Idoso (65+)",
    pain: "Não entende carta do INSS, receita médica, contrato do banco",
    solution: "Áudio explicativo + texto grande + linguagem fundamental",
  },
  {
    icon: <IoBag className="w-5 h-5" />,
    title: "Trabalhador informal",
    pain: "Não sabe interpretar CTPS digital, cálculo de FGTS, contrato de aluguel",
    solution: "Resumo direto do que fazer + geração de documento",
  },
  {
    icon: <IoPencil className="w-5 h-5" />,
    title: "Estudante/Jovem",
    pain: "Não lê TOS dos apps que usa, não entende edital de vestibular",
    solution: "Score de abusividade + card compartilhável",
  },
  {
    icon: <IoBuild className="w-5 h-5" />,
    title: "Empreendedor",
    pain: "Não decifra licitação, contrato social, certidões",
    solution: "Análise estruturada + pontos de atenção + próximos passos",
  },
  {
    icon: <IoPeople className="w-5 h-5" />,
    title: "Qualquer cidadão",
    pain: "Recebe intimação judicial e não sabe o que fazer",
    solution: "Tradução + explicação dos prazos + ações recomendadas",
  },
];

  return (
    <div className="min-h-screen bg-base-100">
      {/* ───── Navbar ───── */}
      <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? "bg-base-100/80 backdrop-blur-md border-base-200" 
          : "bg-transparent border-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`flex items-center gap-2 font-extrabold text-xl transition-colors ${
              isScrolled 
                ? "text-black hover:text-primary" 
                : "text-white hover:text-secondary"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isScrolled 
                ? "bg-secondary" 
                : "bg-transparent"
            }`}>
              <IoShield className={`w-5 h-5 ${
                isScrolled 
                  ? "text-black" 
                  : "text-white"
              }`} />
            </div>
            Cláusula Oculta
          </button>
          <div className="flex items-center gap-6">
            <div className={`hidden md:flex items-center gap-6 text-sm font-medium transition-colors ${
              isScrolled 
                ? "text-gray-400" 
                : "text-white/80"
            }`}>
              <button onClick={() => scrollTo("how-it-works")} className={`transition-colors ${
                isScrolled 
                  ? "hover:text-gray-600" 
                  : "hover:text-secondary"
              }`}>
                Como Funciona
              </button>
              <button onClick={() => scrollTo("profiles")} className={`transition-colors ${
                isScrolled
                  ? "hover:text-gray-600"
                  : "hover:text-secondary"
              }`}>
                Pra quem é
              </button>
              <Link href="/ranking" className={`transition-colors ${
                isScrolled
                  ? "hover:text-gray-600"
                  : "hover:text-secondary"
              }`}>
                Ranking
              </Link>
            </div>
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/analyses"
                  className={`hidden md:block text-sm font-medium transition-colors ${
                    isScrolled ? "text-gray-400 hover:text-gray-600" : "text-white/80 hover:text-secondary"
                  }`}
                >
                  Minhas Análises
                </Link>
                <span className={`hidden md:block text-xs ${isScrolled ? "text-gray-400" : "text-white/60"}`}>
                  {user?.email}
                </span>
                <button
                  onClick={() => logout()}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? "text-gray-400 hover:text-gray-600" : "text-white/80 hover:text-secondary"
                  }`}
                >
                  Sair
                </button>
                <button
                  onClick={handleSelect}
                  className="px-5 py-2 bg-secondary text-secondary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Analisar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? "text-gray-400 hover:text-gray-600" : "text-white/80 hover:text-secondary"
                  }`}
                >
                  Entrar
                </Link>
                <button
                  onClick={handleSelect}
                  className="px-5 py-2 bg-secondary text-secondary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Analisar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-[#17677b] via-primary to-[#1f3549] opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
                <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-secondary bg-white/10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 mb-8"
          >
              <IoShieldCheckmark />
              IA que protege seus direitos
          </motion.div>
          
<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Cláusula <span className="relative inline-block">
  Oculta
  <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-secondary"></span>
</span>
            </h1>
            <h5 className="text-1xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-6">
              Entenda seus{" "}
              <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                contratos
              </span>{" "}
              em linguagem simples
            </h5>

            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transformamos documentos jurídicos e oficiais em linguagem que qualquer pessoa entende. Contratos, termos, intimações — sem surpresas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary btn-lg gap-2 rounded-2xl" onClick={handleSelect}>
                Analisar Documento
                <IoArrowForward />
              </button>
              <button className="btn btn-outline btn-lg rounded-2xl" onClick={() => scrollTo("how-it-works")}>
                Como Funciona?
              </button>
            </div>
            
          </div>
          <div className="mt-32  mx-auto">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">60M+</div>
              <p className="text-sm text-white/60">BENEFICIÁRIOS INSS</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">150M+</div>
              <p className="text-sm text-white/60">USUÁRIOS SUS</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary ">80M+</div>
              <p className="text-sm text-white/60  ">PROCESSOS ATIVOS</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">156M+</div>
              <p className="text-sm text-white/60">USUÁRIOS INTERNET</p>
            </div>
          </div></div>

          {/* Floating Mouse Scroll Indicator */}
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={() => scrollTo("how-it-works")}
            >
              {/* Mouse Icon */}
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center mb-2">
                <motion.div
                  className="w-1 h-2 bg-white/60 rounded-full mt-2"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <p className="text-xs text-white/50 font-medium">Rolar</p>
            </motion.div>
          </motion.div>

       
        </div>
      </section>


      {/* ───── How it works ───── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Como Funciona
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Em apenas quatro passos simples, tenha total clareza sobre qualquer
              documento.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* PASSO 1 - Envie o documento */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#5A8B9A] flex items-center justify-center shadow-lg">
                  <div className="flex gap-1">
                                    <IoLink className="text-2xl text-white" />

                  </div>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">PASSO 1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Envie o documento</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Cole uma URL, tire uma foto ou faça upload do arquivo (PDF, imagem, etc.)
              </p>
            </motion.div>

            {/* PASSO 2 - IA analisa o conteúdo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#E6A947] flex items-center justify-center shadow-lg">
                  <IoDocumentText className="text-2xl text-white" />
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">PASSO 2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">IA analisa o conteúdo</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Nossos agentes de IA identificam cláusulas, calculam riscos e traduzem o juridiquês.
              </p>
            </motion.div>

            {/* PASSO 3 - Veja o resultado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#6FAA75] flex items-center justify-center shadow-lg">
                  <IoShieldCheckmark className="text-2xl text-white" />
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">PASSO 3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Veja o resultado</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Score de risco, explicação em linguagem simples e recomendações de ação.
              </p>
            </motion.div>

            {/* PASSO 4 - Compartilhe ou salve */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#5A8B9A] flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8C19.66,8 21,6.66 21,5C21,3.34 19.66,2 18,2C16.34,2 15,3.34 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9C4.34,9 3,10.34 3,12C3,13.66 4.34,15 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.92 18,21.92C19.61,21.92 20.92,20.61 20.92,19C20.92,17.39 19.61,16.08 18,16.08Z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">PASSO 4</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Compartilhe ou salve</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Envie por WhatsApp, e-mail ou salve para consultar depois.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    {/* ───── Profile cards ───── */}

       <section id="profiles" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-base-content/60 max-w-xl mx-auto text-secondary">
           PÚBLICO-ALVO
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 ">
Pra quem é?          </h2>
          <p className="text-base-content/60 max-w-xl mx-auto">
                   Linguagem acessível para todos os brasileiros.

          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {profiles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary/5 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300 "
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {p.icon}
              </div>
              <h3 className="font-display text-lg text-foreground mb-3">{p.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-destructive/80 font-body">
                  <span className="font-semibold text-red-500">Dor:</span> {p.pain}
                </p>
                <p className="text-sm  font-body">
                  <span className="font-semibold text-green-500">Solução:</span> {p.solution}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-20 px-6 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Tudo que você precisa para entender seus documentos
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              Nossa IA analisa cada detalhe do seu documento, simplifica a
              linguagem e identifica o que realmente importa para você.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 4 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>

            {/* Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 5 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
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
            </motion.div>
          </div>
             {/* Mockup preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 max-w-2xl mx-auto"
          >
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
          </motion.div>
        </div>
      </section>



      {/* ───── Stats / Protection ───── */}
      <section id="protection" className="py-20 px-6 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-[#276c7f] via-[#578686] to-[#2b4355] opacity-95 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Proteção que faz diferença
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Baseado no Código de Defesa do Consumidor e na LGPD, garantindo
              que seus direitos sejam respeitados.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">50+</div>
              <p className="text-sm text-white/70">Artigos do CDC verificados</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">100%</div>
              <p className="text-sm text-white/70">Privacidade dos dados</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">3</div>
              <p className="text-sm text-white/70">Formas de envio</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">&lt;30s</div>
              <p className="text-sm text-white/70">Tempo de análise</p>
            </motion.div>
          </div>
          
        </div>
        
      </section>

      {/* ───── Get Started / CTA ───── */}
      <section id="get-started" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Comece a analisar agora
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Escolha como deseja enviar seu documento e receba uma análise
              completa em segundos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* URL */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
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
            </motion.button>

            {/* Camera */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
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
            </motion.button>

            {/* Upload */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
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
            </motion.button>
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
