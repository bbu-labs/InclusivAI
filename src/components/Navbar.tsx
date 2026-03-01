"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { IoShield } from "react-icons/io5";

interface NavbarProps {
  variant?: "transparent" | "solid";
  rightAction?: ReactNode;
  showNav?: boolean;
  navLinks?: { label: string; href: string }[];
}

export default function Navbar({
  variant = "solid",
  rightAction,
  showNav = false,
  navLinks,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "transparent") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const isTransparent = variant === "transparent" && !isScrolled;

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
          aria-label="Ir para página inicial"
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
          Cláusula Oculta
        </Link>

        <div className="flex items-center gap-6">
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
          {rightAction}
        </div>
      </div>
    </nav>
  );
}
