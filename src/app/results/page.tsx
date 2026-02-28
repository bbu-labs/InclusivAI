"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/StepIndicator";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoChevronForward,
  IoShareSocial,
  IoBookmark,
  IoHome,
  IoShield,
} from "react-icons/io5";
import type { AnalysisResult, Clause, RiskLevel } from "@/types";

const STEPS = ["Entrada", "Processamento", "Confirmação", "Resultado"];

const MOCK_RESULT: AnalysisResult = {
  documentType: "contrato",
  documentTitle: "Contrato de Prestação de Serviços Digitais",
  overallScore: 62,
  riskLevel: "medio",
  summary:
    "Este contrato contém cláusulas que merecem atenção. Identificamos termos que podem limitar seus direitos como consumidor, especialmente relacionados a cancelamento e uso de dados pessoais.",
  clauses: [
    {
      id: "1",
      title: "Cancelamento e Multa Rescisória",
      originalText:
        "O CONTRATANTE que desejar rescindir o presente contrato antes do término da vigência deverá arcar com multa rescisória equivalente a 40% do valor total restante do contrato, além de notificação prévia de 60 dias.",
      simplifiedText:
        "Se você quiser cancelar o contrato antes do prazo, terá que pagar uma multa de 40% do que falta e avisar com 60 dias de antecedência.",
      riskLevel: "alto",
      explanation:
        "Esta multa de 40% é considerada abusiva pelo CDC. O artigo 51 estabelece que penalidades desproporcionais ao consumidor são nulas.",
      cdcReference: "Art. 51, IV - CDC",
      impact: "Pode gerar custos altos em caso de cancelamento.",
    },
    {
      id: "2",
      title: "Compartilhamento de Dados",
      originalText:
        "A CONTRATADA poderá compartilhar os dados pessoais do CONTRATANTE com empresas parceiras para fins de marketing, análise de perfil e ofertas personalizadas, sem necessidade de consentimento adicional.",
      simplifiedText:
        "A empresa pode compartilhar seus dados com outras empresas para te enviar propaganda, sem pedir sua permissão de novo.",
      riskLevel: "alto",
      explanation:
        "O compartilhamento de dados sem consentimento específico viola a LGPD. Você deve ter o direito de escolher se seus dados serão compartilhados.",
      cdcReference: "LGPD - Art. 7, Art. 11",
      impact: "Seus dados pessoais podem ser usados sem seu controle.",
    },
    {
      id: "3",
      title: "Reajuste de Preços",
      originalText:
        "Os valores poderão ser reajustados anualmente pelo IGPM ou outro índice que melhor reflita a variação dos custos operacionais, a exclusivo critério da CONTRATADA.",
      simplifiedText:
        "O preço pode aumentar todo ano. A empresa escolhe qual índice usar para calcular o aumento.",
      riskLevel: "medio",
      explanation:
        "O fato da empresa poder escolher o índice de reajuste dá a ela vantagem excessiva. O ideal é que o índice seja definido previamente no contrato.",
      cdcReference: "Art. 51, X - CDC",
      impact: "O preço pode subir mais do que o esperado.",
    },
    {
      id: "4",
      title: "Foro de Resolução",
      originalText:
        "Fica eleito o foro da comarca da sede da CONTRATADA para dirimir quaisquer questões oriundas do presente contrato.",
      simplifiedText:
        "Se houver um problema judicial, o processo será na cidade onde fica a empresa, não na sua.",
      riskLevel: "baixo",
      explanation:
        "O CDC garante que o consumidor pode processar na sua própria comarca. Esta cláusula pode ser contestada.",
      cdcReference: "Art. 101, I - CDC",
      impact: "Pode dificultar acesso à justiça se a empresa for em outra cidade.",
    },
  ],
  recommendations: [
    "Negocie a redução da multa rescisória para no máximo 10%.",
    "Exija que o compartilhamento de dados dependa do seu consentimento explícito.",
    "Solicite que o índice de reajuste seja fixado (IPCA, por exemplo).",
    "Verifique se a cláusula de foro pode ser alterada para sua comarca.",
  ],
  cdcViolations: [
    "Art. 51, IV - Multa rescisória desproporcional",
    "LGPD Art. 7 - Compartilhamento sem consentimento",
    "Art. 51, X - Reajuste unilateral",
  ],
};

function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "text-success";
    case "medio":
      return "text-warning";
    case "alto":
      return "text-error";
  }
}

function getRiskBadge(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "badge-success";
    case "medio":
      return "badge-warning";
    case "alto":
      return "badge-error";
  }
}

function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return "Baixo Risco";
    case "medio":
      return "Médio Risco";
    case "alto":
      return "Alto Risco";
  }
}

function getRiskIcon(level: RiskLevel) {
  switch (level) {
    case "baixo":
      return IoShieldCheckmark;
    case "medio":
      return IoWarning;
    case "alto":
      return IoAlert;
  }
}

function ScoreGauge({ score, riskLevel }: { score: number; riskLevel: RiskLevel }) {
  const RiskIcon = getRiskIcon(riskLevel);
  const color = getRiskColor(riskLevel);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="radial-progress text-primary"
        style={
          {
            "--value": score,
            "--size": "8rem",
            "--thickness": "0.6rem",
          } as React.CSSProperties
        }
        role="progressbar"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl font-extrabold">{score}</span>
          <span className="text-xs text-base-content/50">/100</span>
        </div>
      </div>
      <div className={`flex items-center gap-1 ${color}`}>
        <RiskIcon className="text-lg" />
        <span className="font-bold text-sm">{getRiskLabel(riskLevel)}</span>
      </div>
    </div>
  );
}

function ClauseCard({ clause, onClick }: { clause: Clause; onClick: () => void }) {
  return (
    <button
      className="card bg-base-200 w-full text-left cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge badge-sm ${getRiskBadge(clause.riskLevel)}`}>
                {getRiskLabel(clause.riskLevel)}
              </span>
            </div>
            <h3 className="font-bold text-sm">{clause.title}</h3>
            <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
              {clause.simplifiedText}
            </p>
          </div>
          <IoChevronForward className="text-lg text-base-content/30 flex-shrink-0 mt-1" />
        </div>
      </div>
    </button>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { state, setAnalysisResult } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Simulate deep analysis
    const timer = setTimeout(() => {
      const mockResult = { ...MOCK_RESULT, documentType: state.documentType || "contrato" };
      setResult(mockResult);
      setAnalysisResult(mockResult);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        {/* ───── Navbar ───── */}
        <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <IoShield className="w-5 h-5 text-black" />
              </div>
              Cláusula Oculta
            </button>
            <span className="text-sm text-base-content/60">Analisando...</span>
          </div>
        </nav>

        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <StepIndicator steps={STEPS} currentStep={3} />

            <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96">
              <span className="loading loading-dots loading-lg text-primary mb-6" />
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Análise profunda em andamento</h2>
                <p className="text-base-content/60 max-w-lg mx-auto">
                  A IA está identificando cláusulas, verificando conformidade com o
                  CDC e calculando o score de risco...
                </p>
              </div>
              <div className="w-full max-w-md mt-8">
                <progress className="progress progress-primary w-full h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-base-100">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <IoShield className="w-5 h-5 text-black" />
            </div>
            Cláusula Oculta
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-base-200 text-base-content font-semibold text-sm rounded-lg hover:bg-base-300 transition-colors"
          >
            Nova Análise
          </button>
        </div>
      </nav>

      {/* ───── Main Content ───── */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={3} />

          <div className="mt-8 max-w-3xl mx-auto">
          {/* Document title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{result.documentTitle}</h2>
            <p className="text-base-content/50">Análise concluída</p>
          </div>

          {/* Score */}
          <div className="flex justify-center mb-8">
            <ScoreGauge score={result.overallScore} riskLevel={result.riskLevel} />
          </div>

          <div className="grid gap-6">
            {/* Summary */}
            <div className="bg-base-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Resumo da Análise</h3>
              <p className="text-base-content/70 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* CDC Violations */}
            {result.cdcViolations.length > 0 && (
              <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-error mb-4 flex items-center gap-2">
                  <IoAlert className="text-xl" />
                  Possíveis violações do CDC
                </h3>
                <ul className="space-y-2">
                  {result.cdcViolations.map((violation, i) => (
                    <li key={i} className="text-sm text-base-content/70 flex gap-3">
                      <span className="text-error font-bold">•</span>
                      <span>{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clauses */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                Cláusulas Identificadas ({result.clauses.length})
              </h3>
              <div className="grid gap-3">
                {result.clauses.map((clause) => (
                  <ClauseCard
                    key={clause.id}
                    clause={clause}
                    onClick={() => router.push(`/clause/${clause.id}`)}
                  />
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-primary mb-4">Recomendações</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-base-content/70 flex gap-3">
                    <span className="text-primary font-bold text-base">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button className="btn btn-outline btn-lg gap-2">
                <IoBookmark />
                Salvar
              </button>
              <button className="btn btn-outline btn-lg gap-2">
                <IoShareSocial />
                Compartilhar
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={() => router.push("/")}
            >
              <IoHome />
              Analisar outro documento
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
