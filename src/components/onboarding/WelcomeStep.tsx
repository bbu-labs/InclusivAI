"use client";

import { useTranslation } from "react-i18next";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10 text-primary"
        >
          <path
            fillRule="evenodd"
            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-2xl font-bold text-base-content">
          {t("onboarding.welcome.title")}
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          {t("onboarding.welcome.body1")}{" "}
          <strong>{t("onboarding.welcome.steps")}</strong> {t("onboarding.welcome.body2")}
        </p>
        <p className="text-base-content/60 text-sm">
          {t("onboarding.welcome.body3")}
        </p>
      </div>

      <button
        onClick={onNext}
        className="btn btn-primary btn-lg mt-4 min-w-[200px] xp-btn"
      >
        {t("onboarding.welcome.start")}
      </button>
    </div>
  );
}
