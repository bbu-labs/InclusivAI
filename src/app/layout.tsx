import type { Metadata } from "next";
import { AppProvider } from "@/contexts/AppContext";
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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
