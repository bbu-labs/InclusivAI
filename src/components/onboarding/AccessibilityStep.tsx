"use client";

import type { AgeGroup } from "@/lib/experience-profiles";

interface AccessibilityStepProps {
  fontSize: number;
  highContrast: boolean;
  ageGroup: AgeGroup;
  onFontSizeChange: (size: number) => void;
  onHighContrastChange: (enabled: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AccessibilityStep({
  fontSize,
  highContrast,
  ageGroup,
  onFontSizeChange,
  onHighContrastChange,
  onNext,
  onBack,
}: AccessibilityStepProps) {
  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-base-content">
          Acessibilidade
        </h2>
        <p className="text-base-content/70">
          Ajuste o visual para sua melhor leitura.
        </p>
      </div>

      {ageGroup === "senior" && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Configuramos para melhor leitura. Ajuste como preferir.
          </span>
        </div>
      )}

      {/* Font Size */}
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="font-medium">Tamanho do texto</span>
          <span className="text-sm text-base-content/60">{fontSize}px</span>
        </label>
        <input
          type="range"
          min={12}
          max={32}
          step={1}
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="range range-primary"
        />
        <div className="flex justify-between text-xs text-base-content/50 px-1">
          <span>12px</span>
          <span>22px</span>
          <span>32px</span>
        </div>

        {/* Live preview */}
        <div
          className="p-4 bg-base-200 rounded-xl border border-base-300"
          style={{ fontSize: `${fontSize}px` }}
        >
          <p className="leading-relaxed">
            Este é um exemplo de como o texto ficará no aplicativo. Ajuste até
            ficar confortável para sua leitura.
          </p>
        </div>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300">
        <div className="space-y-1">
          <div className="font-medium">Alto contraste</div>
          <div className="text-sm text-base-content/60">
            Bordas e textos mais visíveis
          </div>
        </div>
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-lg"
          checked={highContrast}
          onChange={(e) => onHighContrastChange(e.target.checked)}
        />
      </div>

      {/* Contrast preview */}
      {highContrast && (
        <div className="p-4 rounded-xl border-2 border-base-content/30 bg-base-100">
          <p className="font-medium text-base-content">
            Prévia com alto contraste ativado — bordas e textos mais fortes.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="btn btn-ghost">
          Voltar
        </button>
        <button onClick={onNext} className="btn btn-primary xp-btn">
          Continuar
        </button>
      </div>
    </div>
  );
}
