"use client";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ul className="steps steps-horizontal w-full px-4 py-3 text-xs">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`step ${index <= currentStep ? "step-primary" : ""}`}
        >
          {step}
        </li>
      ))}
    </ul>
  );
}
