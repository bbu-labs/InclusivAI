"use client";

import type { AgeGroup } from "@/lib/experience-profiles";

interface TutorialStepProps {
  ageGroup: AgeGroup;
  onFinish: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const TUTORIAL_CARDS = [
  {
    step: "1",
    title: "Cole URL ou tire foto",
    description:
      "Envie o documento que quer analisar: cole um link, tire uma foto ou faça upload de um arquivo.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "IA analisa o documento",
    description:
      "Nossos agentes de IA leem e interpretam cada cláusula, identificando pontos críticos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
        <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Resultado simplificado",
    description:
      "Receba a análise em linguagem simples, com score de proteção e recomendações claras.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    step: "4",
    title: "Pergunte à IA",
    description:
      'Ainda tem dúvidas? Faça perguntas sobre o documento e receba respostas diretas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function TutorialStep({
  ageGroup,
  onFinish,
  onBack,
  isSubmitting,
}: TutorialStepProps) {
  const isSenior = ageGroup === "senior";

  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-base-content">
          Como funciona
        </h2>
        <p className="text-base-content/70">
          Em 4 passos simples, você analisa qualquer documento.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TUTORIAL_CARDS.map((card) => (
          <div
            key={card.step}
            className="flex gap-4 p-4 rounded-xl bg-base-200 border border-base-300"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {card.icon}
            </div>
            <div className="space-y-1">
              <div className="font-medium text-sm">{card.title}</div>
              <div className="text-xs text-base-content/60 leading-relaxed">
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isSenior && (
        <div className="space-y-2 p-4 bg-info/10 rounded-xl border border-info/20">
          <p className="text-sm font-medium text-info-content">
            Dicas para você:
          </p>
          <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
            <li>Você pode ouvir os resultados em áudio</li>
            <li>Pode sempre mudar as configurações depois</li>
            <li>Se precisar de ajuda, pergunte à IA sobre o documento</li>
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="btn btn-ghost">
          Voltar
        </button>
        <button
          onClick={onFinish}
          disabled={isSubmitting}
          className="btn btn-primary btn-lg xp-btn min-w-[200px]"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Começar a analisar"
          )}
        </button>
      </div>
    </div>
  );
}
