"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  type AgeGroup,
  type ExperienceProfile,
  deriveAgeGroup,
  EXPERIENCE_PROFILES,
} from "@/lib/experience-profiles";

interface ExperienceContextType {
  ageGroup: AgeGroup;
  profile: ExperienceProfile;
  isSenior: boolean;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(
  undefined,
);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const { profile: userProfile } = useAuth();

  const ageGroup = useMemo(
    () => deriveAgeGroup(userProfile?.age_range ?? null),
    [userProfile?.age_range],
  );

  const experienceProfile = EXPERIENCE_PROFILES[ageGroup];
  const isSenior = ageGroup === "senior";

  useEffect(() => {
    const root = document.documentElement;

    // Apply CSS custom properties
    for (const [key, value] of Object.entries(experienceProfile.cssVars)) {
      root.style.setProperty(key, value);
    }

    // Apply font size from user profile (overrides CSS var if user customized)
    if (userProfile?.font_size) {
      root.style.fontSize = `${userProfile.font_size}px`;
    }

    // Apply high contrast
    root.setAttribute(
      "data-high-contrast",
      String(userProfile?.high_contrast ?? experienceProfile.autoHighContrast),
    );

    return () => {
      // Cleanup on unmount
      for (const key of Object.keys(experienceProfile.cssVars)) {
        root.style.removeProperty(key);
      }
      root.style.removeProperty("font-size");
      root.removeAttribute("data-high-contrast");
    };
  }, [experienceProfile, userProfile?.font_size, userProfile?.high_contrast]);

  return (
    <ExperienceContext.Provider
      value={{ ageGroup, profile: experienceProfile, isSenior }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error(
      "useExperience must be used within an ExperienceProvider",
    );
  }
  return context;
}
