"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { apiLogin } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { IoMail, IoLockClosed } from "react-icons/io5";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { setSession, setProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { session } = await apiLogin(email, password);

      // Store session in Supabase client for token refresh
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // Load profile
      const { apiGetMe } = await import("@/lib/api");
      const { profile } = await apiGetMe();
      setProfile(profile);

      router.push("/analyze");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar hideUserMenu />

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2">Entrar</h1>
            <p className="text-base-content/60">
              Acesse sua conta para analisar documentos
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
                <span className="label-text font-medium">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-3">
                <IoMail className="text-base-content/40" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Senha</span>
              </label>
              <label className="input input-bordered flex items-center gap-3">
                <IoLockClosed className="text-base-content/40" />
                <input
                  type="password"
                  placeholder="Sua senha"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
              <div className="label">
                <Link href="/forgot-password" className="label-text-alt text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Não tem conta?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
