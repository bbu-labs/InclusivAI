"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { apiSignup } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { IoMail, IoLockClosed, IoPerson } from "react-icons/io5";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setSession, setProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiSignup(email, password, fullName || undefined);

      if (data.session) {
        // Auto-login: session available immediately
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        const { apiGetMe } = await import("@/lib/api");
        try {
          const { profile } = await apiGetMe();
          setProfile(profile);
        } catch {
          // Profile may not be ready immediately
        }

        router.push("/onboarding");
      } else {
        // Email verification required
        setEmailSent(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("signup.error")
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navbar hideUserMenu />

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <IoMail className="text-4xl text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">{t("signup.verifyTitle")}</h1>
            <p className="text-base-content/60 mb-6">
              {t("signup.verifyText")} <strong>{email}</strong>.
              {t("signup.verifyAction")}
            </p>
            <Link href="/login" className="btn btn-primary btn-lg">
              {t("signup.goToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar hideUserMenu />

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2">{t("signup.title")}</h1>
            <p className="text-base-content/60">
              {t("signup.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("signup.name")}</span>
              </label>
              <label className="input input-bordered flex items-center gap-3">
                <IoPerson className="text-base-content/40" />
                <input
                  type="text"
                  placeholder={t("signup.namePlaceholder")}
                  className="grow"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("signup.email")}</span>
              </label>
              <label className="input input-bordered flex items-center gap-3">
                <IoMail className="text-base-content/40" />
                <input
                  type="email"
                  placeholder={t("signup.emailPlaceholder")}
                  className="grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("signup.password")}</span>
              </label>
              <label className="input input-bordered flex items-center gap-3">
                <IoLockClosed className="text-base-content/40" />
                <input
                  type="password"
                  placeholder={t("signup.passwordPlaceholder")}
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                t("signup.submit")
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            {t("signup.hasAccount")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t("signup.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
