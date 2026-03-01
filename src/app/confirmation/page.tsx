"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useExperience } from "@/contexts/ExperienceContext";
import StepIndicator from "@/components/StepIndicator";
import { IoDocumentText, IoCheckmark, IoClose } from "react-icons/io5";
import { type DocType } from "@/types";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";

export default function ConfirmationPage() {
  const router = useRouter();
  const { state } = useApp();
  const { session } = useAuth();
  const { profile: xp } = useExperience();
  const { t } = useTranslation();
  const STEPS = [t("analyze.stepInput"), t("analyze.stepProcessing"), t("analyze.stepConfirmation"), t("analyze.stepResult")];

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!state.documentId || !state.document) {
      router.replace("/analyze");
    }
  }, [session, state.documentId, state.document, router]);

  const handleConfirm = () => {
    router.push("/results");
  };

  const handleReject = () => {
    router.push("/analyze");
  };

  if (!state.document) return null;

  const docType = state.document.doc_type as DocType;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar backHref="/analyze" backLabel={t("confirmation.backLabel")} />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator steps={STEPS} currentStep={2} />

          <div className="mt-8 max-w-2xl mx-auto">
            {/* Document type card */}
            <div className="card bg-base-200 w-full mb-8 shadow-lg">
              <div className="card-body items-center text-center py-8">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <IoDocumentText className="text-5xl text-primary" />
                </div>
                <h2 className="card-title text-xl mb-2">{t("confirmation.title")}</h2>
                <div className="badge badge-primary badge-lg text-sm px-4 py-3">
                  {t("docTypes." + docType) || docType}
                </div>
                <p className="text-base-content/70 mt-4 text-lg font-medium">
                  {state.document.title}
                </p>
              </div>
            </div>

            {/* Confirmation question */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
              <p className="font-bold text-center text-lg mb-2">
                {t("confirmation.question")}{" "}
                <span className="text-primary">
                  {t("docTypes." + docType) || docType}
                </span>
                ?
              </p>
              <p className="text-sm text-base-content/60 text-center">
                {t("confirmation.hint")}
              </p>
            </div>

            {xp.showGuidanceText && (
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t("confirmation.seniorTip")}</span>
              </div>
            )}

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                className="btn btn-outline btn-error btn-lg gap-2"
                onClick={handleReject}
              >
                <IoClose className="text-lg" />
                {t("confirmation.reject")}
              </button>
              <button
                className="btn btn-primary btn-lg gap-2"
                onClick={handleConfirm}
              >
                <IoCheckmark className="text-lg" />
                {t("confirmation.confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
