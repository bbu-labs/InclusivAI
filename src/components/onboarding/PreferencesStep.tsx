"use client";

import type { EducationLevel, PreferredOutput } from "@/types";
import type { AgeGroup } from "@/lib/experience-profiles";

interface PreferencesStepProps {
  educationLevel: EducationLevel | null;
  preferredOutput: PreferredOutput;
  ageGroup: AgeGroup;
  onEducationChange: (level: EducationLevel) => void;
  onOutputChange: (output: PreferredOutput) => void;
  onNext: () => void;
  onBack: () => void;
}

const EDUCATION_OPTIONS: {
  value: EducationLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "fundamental",
    label: "Fundamental",
    description: "Linguagem bem simples, sem termos técnicos",
  },
  {
    value: "medio",
    label: "Médio",
    description: "Linguagem clara com alguns termos explicados",
  },
  {
    value: "superior",
    label: "Superior",
    description: "Linguagem padrão com termos jurídicos básicos",
  },
  {
    value: "pos_graduacao",
    label: "Pós-graduação",
    description: "Linguagem técnica completa",
  },
];

const OUTPUT_OPTIONS: {
  value: PreferredOutput;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "text",
    label: "Texto",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
      </svg>
    ),
  },
  {
    value: "audio",
    label: "Áudio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
      </svg>
    ),
  },
  {
    value: "both",
    label: "Texto e Áudio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
      </svg>
    ),
  },
];

export default function PreferencesStep({
  educationLevel,
  preferredOutput,
  ageGroup,
  onEducationChange,
  onOutputChange,
  onNext,
  onBack,
}: PreferencesStepProps) {
  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-base-content">
          Suas preferências
        </h2>
        <p className="text-base-content/70">
          Como você quer receber as análises?
        </p>
      </div>

      {/* Education Level */}
      <div className="space-y-3">
        <label className="font-medium">Nível de escolaridade</label>
        <p className="text-sm text-base-content/60">
          Isso define a complexidade da linguagem nas análises.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EDUCATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onEducationChange(opt.value)}
              className={`flex flex-col gap-1 p-4 rounded-xl border-2 text-left transition-all ${
                educationLevel === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/40"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-xs text-base-content/60">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Output preference */}
      <div className="space-y-3">
        <label className="font-medium">Formato de saída</label>
        <div className="grid grid-cols-3 gap-3">
          {OUTPUT_OPTIONS.map((opt) => {
            const isRecommended =
              ageGroup === "senior" && opt.value === "both";
            return (
              <button
                key={opt.value}
                onClick={() => onOutputChange(opt.value)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  preferredOutput === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-primary/40"
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2 right-2 badge badge-primary badge-xs text-[10px]">
                    Recomendado
                  </span>
                )}
                <div
                  className={
                    preferredOutput === opt.value
                      ? "text-primary"
                      : "text-base-content/50"
                  }
                >
                  {opt.icon}
                </div>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="btn btn-ghost">
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!educationLevel}
          className="btn btn-primary xp-btn"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
