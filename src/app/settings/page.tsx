"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { apiUpdateProfile, ApiError } from "@/lib/api";
import type { PreferredOutput, AgeRange, EducationLevel } from "@/types";
import {
  SUPPORTED_COUNTRIES,
  COUNTRY_LANGUAGE_MAP,
  COUNTRY_FLAGS,
  COUNTRY_NAMES,
  type SupportedCountry,
  type SupportedLanguage,
} from "@/lib/i18n";
import { IoSave } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/Toast";

export default function SettingsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { session, profile, setProfile, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState<SupportedCountry>("BR");
  const [language, setLanguage] = useState<SupportedLanguage>("pt-BR");
  const [preferredOutput, setPreferredOutput] = useState<PreferredOutput>("text");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (profile) {
      setCountry((profile.country as SupportedCountry) || "BR");
      setLanguage((profile.language as SupportedLanguage) || "pt-BR");
      setPreferredOutput(profile.preferred_output);
      setAgeRange(profile.age_range || "");
      setEducationLevel(profile.education_level || "");
      setFontSize(profile.font_size);
      setHighContrast(profile.high_contrast);
    }
  }, [session, profile, authLoading, router]);

  const handleCountryChange = (newCountry: SupportedCountry) => {
    setCountry(newCountry);
    const newLang = COUNTRY_LANGUAGE_MAP[newCountry];
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("inclusivai-language", newLang);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const updates: Record<string, unknown> = {
        preferred_output: preferredOutput,
        font_size: fontSize,
        high_contrast: highContrast,
        country,
        language,
      };
      if (ageRange) updates.age_range = ageRange;
      if (educationLevel) updates.education_level = educationLevel;

      const { profile: updated } = await apiUpdateProfile(updates as never);
      setProfile(updated);
      showToast(t("settings.saveSuccess"), "success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("settings.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const currentLang = (i18n.language || "pt-BR") as SupportedLanguage;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-2">{t("settings.title")}</h1>
          <p className="text-base-content/60 mb-4">
            {t("settings.subtitle")}
          </p>

          {profile?.has_onboarded && (
            <div className="alert alert-info mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t("settings.onboardingInfo")}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Country */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("settings.countryLabel")}
                </span>
              </label>
              <select
                className="select select-bordered"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value as SupportedCountry)}
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {COUNTRY_FLAGS[c]} {COUNTRY_NAMES[c]?.[currentLang] || c}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred output */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("settings.outputLabel")}
                </span>
              </label>
              <select
                className="select select-bordered"
                value={preferredOutput}
                onChange={(e) =>
                  setPreferredOutput(e.target.value as PreferredOutput)
                }
              >
                <option value="text">{t("settings.outputText")}</option>
                <option value="audio">{t("settings.outputAudio")}</option>
                <option value="both">{t("settings.outputBoth")}</option>
              </select>
            </div>

            {/* Age range */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("settings.ageLabel")}</span>
              </label>
              <select
                className="select select-bordered"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRange)}
              >
                <option value="">{t("settings.ageNone")}</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65+">65+</option>
              </select>
            </div>

            {/* Education level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("settings.educationLabel")}</span>
              </label>
              <select
                className="select select-bordered"
                value={educationLevel}
                onChange={(e) =>
                  setEducationLevel(e.target.value as EducationLevel)
                }
              >
                <option value="">{t("settings.educationNone")}</option>
                <option value="fundamental">{t("settings.educationFundamental")}</option>
                <option value="medio">{t("settings.educationMedio")}</option>
                <option value="superior">{t("settings.educationSuperior")}</option>
                <option value="pos_graduacao">{t("settings.educationPos")}</option>
              </select>
            </div>

            {/* Font size */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("settings.fontSizeLabel", { size: fontSize })}
                </span>
              </label>
              <input
                type="range"
                min={12}
                max={32}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="range range-primary"
              />
              <div className="flex justify-between text-xs text-base-content/40 mt-1">
                <span>12</span>
                <span>22</span>
                <span>32</span>
              </div>
            </div>

            {/* High contrast */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                <span className="label-text font-medium">{t("settings.highContrast")}</span>
              </label>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <IoSave />
                  {t("common.save")}
                </>
              )}
            </button>

            <div className="divider" />

            <button
              className="btn btn-outline btn-sm w-full"
              onClick={async () => {
                try {
                  const { profile: updated } = await apiUpdateProfile({ has_onboarded: false } as never);
                  setProfile(updated);
                  router.push("/onboarding");
                } catch {
                  showToast(t("settings.redoError"), "error");
                }
              }}
            >
              {t("settings.redoOnboarding")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
