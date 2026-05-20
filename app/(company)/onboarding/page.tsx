"use client";

import { motion, AnimatePresence } from "motion/react";
import { verticalFadeIn } from "@/lib/animations";
import { CompanyDetailsStep } from "./_components/company-details-step";
import { SearchMedicalStep } from "./_components/search-medical-step";
import { PendingRequestStep } from "./_components/pending-request-step";
import { useOnboarding } from "../hooks/useOnboarding";

type OnboardingStep = "company_details" | "search_medical" | "pending_request" | "completed";

export default function OnboardingPage() {

  const { statusQuery, queryClient } = useOnboarding();

  if (statusQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currentStep = statusQuery.data?.onboardingStatus ?? "company_details";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial="initial"
          animate="animate"
          variants={verticalFadeIn}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenue sur Medli'
          </h1>
          <p className="text-slate-600">
            Configurez votre entreprise en quelques étapes
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {["company_details", "search_medical", "pending_request"].map((step, index) => (
              <div
                key={step}
                className={`h-2 w-16 rounded-full transition-colors ${getStepIndex(currentStep) >= index
                    ? "bg-blue-600"
                    : "bg-slate-200"
                  }`}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === "company_details" && (
            <CompanyDetailsStep
              key="company_details"
              onSuccess={() => queryClient.invalidateQueries()}
            />
          )}
          {currentStep === "search_medical" && (
            <SearchMedicalStep
              key="search_medical"
              onSuccess={() => queryClient.invalidateQueries()}
            />
          )}
          {currentStep === "pending_request" && (
            <PendingRequestStep
              key="pending_request"
              onDismiss={() => queryClient.invalidateQueries()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getStepIndex(step: OnboardingStep): number {
  switch (step) {
    case "company_details":
      return 0;
    case "search_medical":
      return 1;
    case "pending_request":
      return 2;
    case "completed":
      return 3;
  }
}

