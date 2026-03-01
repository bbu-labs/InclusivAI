"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/termos",
  "/privacidade",
  "/onboarding",
  "/forgot-password",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/share/")) return true;
  if (pathname.startsWith("/onboarding")) return true;
  return false;
}

export default function OnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!session || !profile) return;
    if (isPublicPath(pathname)) return;

    if (!profile.has_onboarded) {
      router.replace("/onboarding");
    }
  }, [session, profile, isLoading, pathname, router]);

  return <>{children}</>;
}
