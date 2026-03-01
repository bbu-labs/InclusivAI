"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { AgeRange } from "@/types";
import type { AgeGroup } from "@/lib/experience-profiles";
import { deriveAgeGroup } from "@/lib/experience-profiles";

interface AgeStepProps {
  value: AgeRange | null;
  onChange: (ageRange: AgeRange, ageGroup: AgeGroup) => void;
  onNext: () => void;
  onBack: () => void;
}

const AGE_GROUP_ICONS = [
  (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ),
  (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
      <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
    </svg>
  ),
  (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15a8.25 8.25 0 00-8.25 8.25.75.75 0 01-1.5 0c0-2.602.948-4.987 2.52-6.822a4.5 4.5 0 00-4.02-2.178H6a.75.75 0 01-.75-.75c0-2.662 1.236-5.036 3.163-6.578V3.375a1.125 1.125 0 012.25 0v4.688c-.126.073-.249.15-.369.232a6.588 6.588 0 00-.856.738V1.875z" />
    </svg>
  ),
];

const AGE_GROUP_RANGES: AgeRange[][] = [
  ["18-24", "25-34"],
  ["35-44", "45-54"],
  ["55-64", "65+"],
];

export default function AgeStep({
  value,
  onChange,
  onNext,
  onBack,
}: AgeStepProps) {
  const { t } = useTranslation();

  const AGE_GROUPS = [
    {
      label: "18–34",
      subtitle: t("onboarding.age.young"),
      description: t("onboarding.age.youngDesc"),
      ranges: AGE_GROUP_RANGES[0],
      icon: AGE_GROUP_ICONS[0],
    },
    {
      label: "35–54",
      subtitle: t("onboarding.age.adult"),
      description: t("onboarding.age.adultDesc"),
      ranges: AGE_GROUP_RANGES[1],
      icon: AGE_GROUP_ICONS[1],
    },
    {
      label: "55+",
      subtitle: t("onboarding.age.senior"),
      description: t("onboarding.age.seniorDesc"),
      ranges: AGE_GROUP_RANGES[2],
      icon: AGE_GROUP_ICONS[2],
    },
  ];

  const PRECISE_RANGES: { value: AgeRange; label: string }[] = [
    { value: "18-24", label: t("onboarding.age.range18") },
    { value: "25-34", label: t("onboarding.age.range25") },
    { value: "35-44", label: t("onboarding.age.range35") },
    { value: "45-54", label: t("onboarding.age.range45") },
    { value: "55-64", label: t("onboarding.age.range55") },
    { value: "65+", label: t("onboarding.age.range65") },
  ];

  const [selectedGroup, setSelectedGroup] = useState<number | null>(() => {
    if (!value) return null;
    return AGE_GROUP_RANGES.findIndex((ranges) => ranges.includes(value));
  });
  const [showPrecise, setShowPrecise] = useState(false);

  const handleGroupSelect = (index: number) => {
    setSelectedGroup(index);
    // Default to first range in the group
    const defaultRange = AGE_GROUP_RANGES[index][0];
    onChange(defaultRange, deriveAgeGroup(defaultRange));
  };

  const handlePreciseSelect = (range: AgeRange) => {
    const groupIndex = AGE_GROUP_RANGES.findIndex((ranges) => ranges.includes(range));
    setSelectedGroup(groupIndex);
    onChange(range, deriveAgeGroup(range));
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-base-content">
          {t("onboarding.age.title")}
        </h2>
        <p className="text-base-content/70">
          {t("onboarding.age.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {AGE_GROUPS.map((group, index) => (
          <button
            key={group.label}
            onClick={() => handleGroupSelect(index)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
              selectedGroup === index
                ? "border-primary bg-primary/5 shadow-md"
                : "border-base-300 hover:border-primary/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                selectedGroup === index
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/60"
              }`}
            >
              {group.icon}
            </div>
            <div className="space-y-1">
              <div className="font-bold text-lg">{group.label}</div>
              <div className="text-sm font-medium text-primary">
                {group.subtitle}
              </div>
              <div className="text-xs text-base-content/60">
                {group.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedGroup !== null && !showPrecise && (
        <button
          onClick={() => setShowPrecise(true)}
          className="text-sm text-primary hover:underline self-center"
        >
          {t("onboarding.age.precise")}
        </button>
      )}

      {showPrecise && (
        <div className="flex flex-wrap justify-center gap-2">
          {PRECISE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePreciseSelect(range.value)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                value === range.value
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 hover:border-primary/40"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="btn btn-ghost">
          {t("common.back")}
        </button>
        <button
          onClick={onNext}
          disabled={selectedGroup === null}
          className="btn btn-primary xp-btn"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}
