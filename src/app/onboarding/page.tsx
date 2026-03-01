"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { apiUpdateProfile, ApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import {
  type AgeGroup,
  deriveAgeGroup,
  EXPERIENCE_PROFILES,
} from "@/lib/experience-profiles";
import type { AgeRange, EducationLevel, PreferredOutput } from "@/types";
import type { SupportedCountry, SupportedLanguage } from "@/lib/i18n";
import StepIndicator from "@/components/StepIndicator";
import Navbar from "@/components/Navbar";
import CountryStep from "@/components/onboarding/CountryStep";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import AgeStep from "@/components/onboarding/AgeStep";
import AccessibilityStep from "@/components/onboarding/AccessibilityStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";
import TutorialStep from "@/components/onboarding/TutorialStep";

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, setProfile } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Country / language state
  const [country, setCountry] = useState<SupportedCountry | null>(
    (profile?.country as SupportedCountry) ?? null,
  );
  const [language, setLanguage] = useState<SupportedLanguage | null>(
    (profile?.language as SupportedLanguage) ?? null,
  );

  // Form state
  const [ageRange, setAgeRange] = useState<AgeRange | null>(
    profile?.age_range ?? null,
  );
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(
    deriveAgeGroup(profile?.age_range ?? null),
  );
  const [fontSize, setFontSize] = useState(
    profile?.font_size ?? EXPERIENCE_PROFILES.adulto.defaultFontSize,
  );
  const [highContrast, setHighContrast] = useState(
    profile?.high_contrast ?? false,
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(
    profile?.education_level ?? null,
  );
  const [preferredOutput, setPreferredOutput] = useState<PreferredOutput>(
    profile?.preferred_output ?? "text",
  );

  const STEPS = [
    t("onboarding.steps.country"),
    t("onboarding.steps.welcome"),
    t("onboarding.steps.age"),
    t("onboarding.steps.accessibility"),
    t("onboarding.steps.preferences"),
    t("onboarding.steps.tutorial"),
  ];

  const handleCountrySelect = useCallback(
    (c: SupportedCountry, lang: SupportedLanguage) => {
      setCountry(c);
      setLanguage(lang);
    },
    [],
  );

  const handleAgeChange = useCallback(
    (range: AgeRange, group: AgeGroup) => {
      setAgeRange(range);
      setAgeGroup(group);
      const xp = EXPERIENCE_PROFILES[group];
      setFontSize(xp.defaultFontSize);
      setHighContrast(xp.autoHighContrast);
      setPreferredOutput(xp.defaultOutput);
      setEducationLevel(xp.defaultSimplification);
    },
    [],
  );

  const handleFinish = useCallback(async () => {
    if (!ageRange || !educationLevel) return;
    setIsSubmitting(true);
    try {
      const updates: Record<string, unknown> = {
        age_range: ageRange,
        education_level: educationLevel,
        preferred_output: preferredOutput,
        font_size: fontSize,
        high_contrast: highContrast,
        has_onboarded: true,
      };
      if (country) updates.country = country;
      if (language) updates.language = language;

      const { profile: updated } = await apiUpdateProfile(updates as never);
      setProfile(updated);
      router.push("/analyze");
    } catch (err) {
      setIsSubmitting(false);
      const message = err instanceof ApiError ? err.message : t("onboarding.errors.updateFailed");
      showToast(message, "error");
    }
  }, [
    ageRange,
    educationLevel,
    preferredOutput,
    fontSize,
    highContrast,
    country,
    language,
    setProfile,
    router,
    showToast,
    t,
  ]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <>
      <Navbar variant="solid" showNav={false} hideUserMenu />
      <div className="min-h-screen bg-base-100 flex flex-col">
        <div className="w-full max-w-2xl mx-auto px-6 py-6 flex-1 flex flex-col">
          <StepIndicator steps={STEPS} currentStep={step} />

          <div className="flex-1 flex flex-col justify-center py-6">
            {step === 0 && (
              <CountryStep
                country={country}
                onSelect={handleCountrySelect}
                onNext={next}
              />
            )}
            {step === 1 && <WelcomeStep onNext={next} />}
            {step === 2 && (
              <AgeStep
                value={ageRange}
                onChange={handleAgeChange}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <AccessibilityStep
                fontSize={fontSize}
                highContrast={highContrast}
                ageGroup={ageGroup}
                onFontSizeChange={setFontSize}
                onHighContrastChange={setHighContrast}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 4 && (
              <PreferencesStep
                educationLevel={educationLevel}
                preferredOutput={preferredOutput}
                ageGroup={ageGroup}
                onEducationChange={setEducationLevel}
                onOutputChange={setPreferredOutput}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 5 && (
              <TutorialStep
                ageGroup={ageGroup}
                onFinish={handleFinish}
                onBack={back}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
