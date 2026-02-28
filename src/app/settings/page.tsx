"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiUpdateProfile, ApiError } from "@/lib/api";
import type { PreferredOutput, AgeRange, EducationLevel } from "@/types";
import { IoShield, IoSave } from "react-icons/io5";

export default function SettingsPage() {
  const router = useRouter();
  const { session, profile, setProfile, isLoading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setPreferredOutput(profile.preferred_output);
      setAgeRange(profile.age_range || "");
      setEducationLevel(profile.education_level || "");
      setFontSize(profile.font_size);
      setHighContrast(profile.high_contrast);
    }
  }, [session, profile, authLoading, router]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updates: Record<string, unknown> = {
        preferred_output: preferredOutput,
        font_size: fontSize,
        high_contrast: highContrast,
      };
      if (ageRange) updates.age_range = ageRange;
      if (educationLevel) updates.education_level = educationLevel;

      const { profile: updated } = await apiUpdateProfile(updates as never);
      setProfile(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-base-100/95 backdrop-blur-md border-base-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl text-black hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <IoShield className="w-5 h-5 text-black" />
            </div>
            Cláusula Oculta
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold mb-2">Configurações</h1>
          <p className="text-base-content/60 mb-8">
            Personalize sua experiência
          </p>

          <div className="space-y-6">
            {/* Preferred output */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Formato de saída preferido
                </span>
              </label>
              <select
                className="select select-bordered"
                value={preferredOutput}
                onChange={(e) =>
                  setPreferredOutput(e.target.value as PreferredOutput)
                }
              >
                <option value="text">Texto</option>
                <option value="audio">Áudio</option>
                <option value="both">Texto e Áudio</option>
              </select>
            </div>

            {/* Age range */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Faixa etária</span>
              </label>
              <select
                className="select select-bordered"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRange)}
              >
                <option value="">Não informar</option>
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
                <span className="label-text font-medium">Escolaridade</span>
              </label>
              <select
                className="select select-bordered"
                value={educationLevel}
                onChange={(e) =>
                  setEducationLevel(e.target.value as EducationLevel)
                }
              >
                <option value="">Não informar</option>
                <option value="fundamental">Ensino Fundamental</option>
                <option value="medio">Ensino Médio</option>
                <option value="superior">Ensino Superior</option>
                <option value="pos_graduacao">Pós-Graduação</option>
              </select>
            </div>

            {/* Font size */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Tamanho da fonte: {fontSize}px
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
                <span className="label-text font-medium">Alto contraste</span>
              </label>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success text-sm">
                <span>Configurações salvas com sucesso!</span>
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
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
