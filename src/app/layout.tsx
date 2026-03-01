import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import { AppProvider } from "@/contexts/AppContext";
import I18nProvider from "@/components/I18nProvider";
import Footer from "@/components/Footer";
import OnboardingGuard from "@/components/OnboardingGuard";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cláusula Oculta - InclusivAI",
  description:
    "Sistema multi-agente de IA que transforma documentos oficiais, jurídicos ou contratuais em linguagem acessível.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="inclusivai">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Pular para conteúdo
        </a>
        <I18nProvider>
          <AuthProvider>
            <LanguageProvider>
              <ExperienceProvider>
                <AppProvider>
                  <ToastProvider>
                    <OnboardingGuard>
                      <main id="main-content">{children}</main>
                      <Footer />
                    </OnboardingGuard>
                  </ToastProvider>
                </AppProvider>
              </ExperienceProvider>
            </LanguageProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
