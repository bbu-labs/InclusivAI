"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import {
  SUPPORTED_COUNTRIES,
  COUNTRY_LANGUAGE_MAP,
  type SupportedCountry,
  type SupportedLanguage,
} from "@/lib/i18n";

interface LanguageContextType {
  country: SupportedCountry;
  language: SupportedLanguage;
  isSupported: boolean;
  detectedCountry: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getDetectedCountry(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("detected-country="));
  return match ? match.split("=")[1] : null;
}

function resolveCountry(
  profileCountry: string | null | undefined,
  detected: string | null
): SupportedCountry {
  if (
    profileCountry &&
    (SUPPORTED_COUNTRIES as readonly string[]).includes(profileCountry)
  ) {
    return profileCountry as SupportedCountry;
  }
  if (
    detected &&
    (SUPPORTED_COUNTRIES as readonly string[]).includes(detected)
  ) {
    return detected as SupportedCountry;
  }
  return "BR";
}

function resolveLanguage(
  profileLanguage: string | null | undefined,
  country: SupportedCountry
): SupportedLanguage {
  if (
    profileLanguage &&
    (["pt-BR", "en-US", "fr-FR"] as string[]).includes(profileLanguage)
  ) {
    return profileLanguage as SupportedLanguage;
  }
  return COUNTRY_LANGUAGE_MAP[country];
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const { i18n } = useTranslation();

  const detectedCountry = useMemo(() => getDetectedCountry(), []);

  const country = useMemo(
    () => resolveCountry(profile?.country, detectedCountry),
    [profile?.country, detectedCountry]
  );

  const language = useMemo(
    () => resolveLanguage(profile?.language, country),
    [profile?.language, country]
  );

  const isSupported = useMemo(() => {
    if (!detectedCountry) return true;
    return (SUPPORTED_COUNTRIES as readonly string[]).includes(detectedCountry);
  }, [detectedCountry]);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      localStorage.setItem("inclusivai-language", language);
    }
  }, [language, i18n]);

  return (
    <LanguageContext.Provider
      value={{ country, language, isSupported, detectedCountry }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
