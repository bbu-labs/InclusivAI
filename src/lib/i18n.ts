import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "../../public/locales/pt-BR/common.json";
import enUS from "../../public/locales/en-US/common.json";
import frFR from "../../public/locales/fr-FR/common.json";

export const SUPPORTED_LANGUAGES = ["pt-BR", "en-US", "fr-FR"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const SUPPORTED_COUNTRIES = ["BR", "US", "FR"] as const;
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const COUNTRY_LANGUAGE_MAP: Record<SupportedCountry, SupportedLanguage> = {
  BR: "pt-BR",
  US: "en-US",
  FR: "fr-FR",
};

export const LANGUAGE_COUNTRY_MAP: Record<SupportedLanguage, SupportedCountry> = {
  "pt-BR": "BR",
  "en-US": "US",
  "fr-FR": "FR",
};

export const COUNTRY_NAMES: Record<SupportedCountry, Record<SupportedLanguage, string>> = {
  BR: { "pt-BR": "Brasil", "en-US": "Brazil", "fr-FR": "Brésil" },
  US: { "pt-BR": "Estados Unidos", "en-US": "United States", "fr-FR": "États-Unis" },
  FR: { "pt-BR": "França", "en-US": "France", "fr-FR": "France" },
};

export const COUNTRY_FLAGS: Record<SupportedCountry, string> = {
  BR: "🇧🇷",
  US: "🇺🇸",
  FR: "🇫🇷",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": { translation: ptBR },
      "en-US": { translation: enUS },
      "fr-FR": { translation: frFR },
    },
    fallbackLng: "pt-BR",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "inclusivai-language",
      caches: ["localStorage"],
    },
  });

export default i18n;
