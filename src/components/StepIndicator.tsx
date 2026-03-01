"use client";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const SHORT_LABELS: Record<string, string> = {
  Entrada: "1",
  Processamento: "2",
  "Confirmação": "3",
  Resultado: "4",
};

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ul className="steps steps-horizontal w-full px-4 py-3 text-xs">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`step ${index <= currentStep ? "step-primary" : ""}`}
        >
          <span className="hidden sm:inline">{step}</span>
          <span className="sm:hidden">{SHORT_LABELS[step] || step}</span>
        </li>
      ))}
    </ul>
  );
}
