import type { AgeRange, EducationLevel, PreferredOutput } from "@/types";

export type AgeGroup = "jovem" | "adulto" | "senior";

export interface ExperienceProfile {
  cssVars: {
    "--xp-font-base": string;
    "--xp-font-heading": string;
    "--xp-spacing": string;
    "--xp-btn-height": string;
    "--xp-icon-size": string;
    "--xp-line-height": string;
    "--xp-transition-speed": string;
    "--xp-card-padding": string;
  };
  preferAudio: boolean;
  showGuidanceText: boolean;
  simplifiedNav: boolean;
  autoHighContrast: boolean;
  defaultFontSize: number;
  defaultOutput: PreferredOutput;
  defaultSimplification: EducationLevel;
}

export function deriveAgeGroup(ageRange: AgeRange | null): AgeGroup {
  if (!ageRange) return "adulto";
  switch (ageRange) {
    case "18-24":
    case "25-34":
      return "jovem";
    case "35-44":
    case "45-54":
      return "adulto";
    case "55-64":
    case "65+":
      return "senior";
  }
}

export const EXPERIENCE_PROFILES: Record<AgeGroup, ExperienceProfile> = {
  jovem: {
    cssVars: {
      "--xp-font-base": "16px",
      "--xp-font-heading": "24px",
      "--xp-spacing": "1rem",
      "--xp-btn-height": "2.5rem",
      "--xp-icon-size": "1.25rem",
      "--xp-line-height": "1.5",
      "--xp-transition-speed": "150ms",
      "--xp-card-padding": "1rem",
    },
    preferAudio: false,
    showGuidanceText: false,
    simplifiedNav: false,
    autoHighContrast: false,
    defaultFontSize: 16,
    defaultOutput: "text",
    defaultSimplification: "superior",
  },
  adulto: {
    cssVars: {
      "--xp-font-base": "17px",
      "--xp-font-heading": "26px",
      "--xp-spacing": "1.125rem",
      "--xp-btn-height": "2.75rem",
      "--xp-icon-size": "1.375rem",
      "--xp-line-height": "1.6",
      "--xp-transition-speed": "200ms",
      "--xp-card-padding": "1.25rem",
    },
    preferAudio: false,
    showGuidanceText: false,
    simplifiedNav: false,
    autoHighContrast: false,
    defaultFontSize: 17,
    defaultOutput: "text",
    defaultSimplification: "medio",
  },
  senior: {
    cssVars: {
      "--xp-font-base": "22px",
      "--xp-font-heading": "30px",
      "--xp-spacing": "1.5rem",
      "--xp-btn-height": "3.5rem",
      "--xp-icon-size": "1.75rem",
      "--xp-line-height": "1.8",
      "--xp-transition-speed": "300ms",
      "--xp-card-padding": "1.75rem",
    },
    preferAudio: true,
    showGuidanceText: true,
    simplifiedNav: true,
    autoHighContrast: true,
    defaultFontSize: 22,
    defaultOutput: "both",
    defaultSimplification: "fundamental",
  },
};
