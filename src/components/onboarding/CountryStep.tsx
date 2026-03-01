"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoGlobeOutline, IoCheckmarkCircle } from "react-icons/io5";
import {
  SUPPORTED_COUNTRIES,
  COUNTRY_LANGUAGE_MAP,
  COUNTRY_FLAGS,
  COUNTRY_NAMES,
  type SupportedCountry,
  type SupportedLanguage,
} from "@/lib/i18n";

interface CountryStepProps {
  country: SupportedCountry | null;
  onSelect: (country: SupportedCountry, language: SupportedLanguage) => void;
  onNext: () => void;
}

export default function CountryStep({ country, onSelect, onNext }: CountryStepProps) {
  const { t, i18n } = useTranslation();
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Read detected-country cookie
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith("detected-country="));
    const detected = match ? match.split("=")[1] : null;
    setDetectedCountry(detected);

    const supported = detected
      ? (SUPPORTED_COUNTRIES as readonly string[]).includes(detected)
      : true;
    setIsSupported(supported);

    // Auto-select if detected and supported
    if (detected && supported && !country) {
      const c = detected as SupportedCountry;
      onSelect(c, COUNTRY_LANGUAGE_MAP[c]);
    }
  }, [country, onSelect]);

  const currentLang = (i18n.language || "pt-BR") as SupportedLanguage;

  const handleCountrySelect = (c: SupportedCountry) => {
    const lang = COUNTRY_LANGUAGE_MAP[c];
    onSelect(c, lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("inclusivai-language", lang);
    setShowPicker(false);
  };

  const handleConfirmAndNext = () => {
    if (country) onNext();
  };

  const getCountryDisplayName = (code: string): string => {
    // For unsupported countries, use Intl
    try {
      return new Intl.DisplayNames([i18n.language], { type: "region" }).of(code) || code;
    } catch {
      return code;
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <IoGlobeOutline className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{t("onboarding.country.title")}</h2>
        <p className="text-base-content/60">{t("onboarding.country.subtitle")}</p>
      </div>

      {!isSupported && detectedCountry && (
        <div className="alert alert-warning text-left text-sm">
          <span>
            {t("onboarding.country.unsupported", {
              country: getCountryDisplayName(detectedCountry),
            })}
          </span>
        </div>
      )}

      {/* Country confirmed state */}
      {country && !showPicker && (
        <div className="space-y-4">
          <div className="bg-base-200 rounded-2xl p-6 inline-block">
            <span className="text-5xl">
              {COUNTRY_FLAGS[country]}
            </span>
            <p className="mt-2 font-semibold text-lg">
              {COUNTRY_NAMES[country]?.[currentLang] || country}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirmAndNext}
            >
              <IoCheckmarkCircle className="w-5 h-5" />
              {t("onboarding.country.confirmYes", {
                country: COUNTRY_NAMES[country]?.[currentLang] || country,
              })}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowPicker(true)}
            >
              {t("onboarding.country.change")}
            </button>
          </div>
        </div>
      )}

      {/* Country picker */}
      {(!country || showPicker) && (
        <div className="space-y-4">
          {!isSupported && (
            <p className="text-sm text-base-content/50">
              {t("onboarding.country.select")}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
            {SUPPORTED_COUNTRIES.map((c) => (
              <button
                key={c}
                className={`btn btn-lg justify-start gap-3 ${
                  country === c ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => handleCountrySelect(c)}
              >
                <span className="text-2xl">{COUNTRY_FLAGS[c]}</span>
                <span>{COUNTRY_NAMES[c]?.[currentLang] || c}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
