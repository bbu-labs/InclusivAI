"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoShield, IoPersonCircle, IoLogOut, IoList, IoTrophy, IoSettings, IoArrowBack } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useExperience } from "@/contexts/ExperienceContext";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  variant?: "transparent" | "solid";
  showNav?: boolean;
  navLinks?: { label: string; href: string }[];
  backHref?: string;
  backLabel?: string;
  pageAction?: ReactNode;
  statusText?: string;
  hideUserMenu?: boolean;
}

const NO_AUTO_CTA_PATHS = ["/analyze", "/processing", "/confirmation", "/results"];

export default function Navbar({
  variant = "solid",
  showNav = false,
  navLinks,
  backHref,
  backLabel = "Voltar",
  pageAction,
  statusText,
  hideUserMenu = false,
}: NavbarProps) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { session, user, logout } = useAuth();
  const { profile: xp } = useExperience();

  useEffect(() => {
    if (variant !== "transparent") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const isTransparent = variant === "transparent" && !isScrolled;

  const showAutoCta =
    session &&
    !statusText &&
    !pageAction &&
    !NO_AUTO_CTA_PATHS.includes(pathname);

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-base-100/95 backdrop-blur-md border-base-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`flex items-center gap-2 font-extrabold text-xl transition-colors ${
            isTransparent
              ? "text-white hover:text-secondary"
              : "text-black hover:text-primary"
          }`}
          aria-label={t("navbar.goHome")}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isTransparent ? "bg-transparent" : "bg-secondary"
            }`}
          >
            <IoShield
              className={`w-5 h-5 ${
                isTransparent ? "text-white" : "text-black"
              }`}
            />
          </div>
          {t("common.brandName")}
        </Link>

        <div className="flex items-center gap-4">
          {showNav && navLinks && (
            <div
              className={`hidden md:flex items-center gap-6 text-sm font-medium transition-colors ${
                isTransparent ? "text-white/80" : "text-gray-400"
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isTransparent
                      ? "hover:text-secondary"
                      : "hover:text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {statusText && (
            <span className="text-sm text-base-content/60">{statusText}</span>
          )}

          {backHref && (
            <Link
              href={backHref}
              className={`btn btn-ghost btn-sm gap-1 ${
                isTransparent ? "text-white hover:bg-white/10" : ""
              }`}
            >
              <IoArrowBack className="text-sm" />
              {backLabel}
            </Link>
          )}

          {pageAction}

          {showAutoCta && (
            <Link href="/analyze" className="btn btn-primary btn-sm">
              {t("navbar.analyze")}
            </Link>
          )}

          {!hideUserMenu && session && user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn btn-ghost btn-circle ${
                  isTransparent ? "text-white hover:bg-white/10" : ""
                }`}
                aria-label={t("navbar.userMenu")}
              >
                <IoPersonCircle className="w-6 h-6" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg border border-base-200 mt-2"
              >
                <li className="menu-title px-4 py-2">
                  <span className="text-xs text-base-content/50 truncate">
                    {user.email}
                  </span>
                </li>
                {xp.simplifiedNav ? (
                  <>
                    <li>
                      <Link href="/analyze" className="gap-2 py-3 text-base">
                        <IoList className="text-lg" />
                        {t("navbar.analyze")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="gap-2 py-3 text-base">
                        <IoSettings className="text-lg" />
                        {t("navbar.settings")}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/analyses" className="gap-2">
                        <IoList className="text-base" />
                        {t("navbar.myAnalyses")}
                      </Link>
                    </li>
                    {/* Ranking hidden — feature in progress
                    <li>
                      <Link href="/ranking" className="gap-2">
                        <IoTrophy className="text-base" />
                        {t("navbar.ranking")}
                      </Link>
                    </li>
                    */}
                    <li>
                      <Link href="/settings" className="gap-2">
                        <IoSettings className="text-base" />
                        {t("navbar.settings")}
                      </Link>
                    </li>
                  </>
                )}
                <div className="divider my-1" />
                <li>
                  <button onClick={() => logout()} className={`gap-2 text-error ${xp.simplifiedNav ? "py-3 text-base" : ""}`}>
                    <IoLogOut className={xp.simplifiedNav ? "text-lg" : "text-base"} />
                    {t("navbar.logout")}
                  </button>
                </li>
              </ul>
            </div>
          ) : !hideUserMenu && !session ? (
            <Link
              href="/login"
              className={`btn btn-ghost btn-sm ${
                isTransparent ? "text-white hover:bg-white/10" : ""
              }`}
            >
              {t("navbar.login")}
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
