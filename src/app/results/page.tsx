"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import AppShell from "@/components/AppShell";
import {
  IoShieldCheckmark,
  IoWarning,
  IoAlert,
  IoChevronForward,
  IoShareSocial,
  IoBookmark,
  IoHome,
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
      <AppShell>
      <div className="flex flex-col min-h-screen">
        <Header title="Analisando" />
        <StepIndicator steps={STEPS} currentStep={3} />

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <span className="loading loading-dots loading-lg text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">Análise profunda em andamento</h2>
            <p className="text-sm text-base-content/60">
              A IA está identificando cláusulas, verificando conformidade com o
              CDC e calculando o score de risco...
            </p>
          </div>
          <div className="w-full max-w-xs">
            <progress className="progress progress-primary w-full" />
          </div>
        </div>
      </div>
      </AppShell>
    );
  }

  if (!result) return null;

  return (
    <AppShell>
    <div className="flex flex-col min-h-screen">
      <Header title="Resultado" showBack backTo="/" />
      <StepIndicator steps={STEPS} currentStep={3} />

      <div className="flex-1 px-6 py-6 flex flex-col gap-6">
        {/* Document title */}
        <div className="text-center">
          <h2 className="text-lg font-bold">{result.documentTitle}</h2>
          <p className="text-xs text-base-content/50 mt-1">Análise concluída</p>
        </div>

        {/* Score */}
        <div className="flex justify-center">
          <ScoreGauge score={result.overallScore} riskLevel={result.riskLevel} />
        </div>

        {/* Summary */}
        <div className="bg-base-200 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-2">Resumo da Análise</h3>
          <p className="text-sm text-base-content/70 leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* CDC Violations */}
        {result.cdcViolations.length > 0 && (
          <div className="bg-error/5 border border-error/20 rounded-xl p-4">
            <h3 className="font-bold text-sm text-error mb-2 flex items-center gap-2">
              <IoAlert />
              Possíveis violações do CDC
            </h3>
            <ul className="space-y-1">
              {result.cdcViolations.map((violation, i) => (
                <li key={i} className="text-xs text-base-content/70 flex gap-2">
                  <span className="text-error">•</span>
                  {violation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Clauses */}
        <div>
          <h3 className="font-bold text-sm mb-3">
            Cláusulas Identificadas ({result.clauses.length})
          </h3>
          <div className="flex flex-col gap-3">
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
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="font-bold text-sm text-primary mb-2">Recomendações</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-base-content/70 flex gap-2">
                <span className="text-primary font-bold">{i + 1}.</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button className="btn btn-outline btn-sm flex-1">
            <IoBookmark />
            Salvar
          </button>
          <button className="btn btn-outline btn-sm flex-1">
            <IoShareSocial />
            Compartilhar
          </button>
        </div>

        <button
          className="btn btn-primary w-full mt-2"
          onClick={() => router.push("/")}
        >
          <IoHome />
          Analisar outro documento
        </button>
      </div>
    </div>
    </AppShell>
  );
}
