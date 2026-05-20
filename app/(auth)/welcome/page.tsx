"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Building2, Stethoscope, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const statusQuery = useQuery({
    ...orpc.onboarding.getStatus.queryOptions({}),
    enabled: !!session,
  });

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/sign-in");
    }
  }, [session, sessionPending, router]);

  useEffect(() => {
    if (!statusQuery.data) return;

    if (statusQuery.data.type === "medical_staff") {
      router.push("/medical");
      return;
    }

    if (statusQuery.data.type === "employee") {
      const onboardingStatus = statusQuery.data.onboardingStatus;
      if (onboardingStatus === "completed") {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [statusQuery.data, router]);

  if (sessionPending || statusQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session || statusQuery.data?.type !== "none") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-6">
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="w-full max-w-3xl"
      >
        <motion.div variants={verticalFadeIn} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Bienvenue sur Medli'
          </h1>
          <p className="text-slate-600 text-lg">
            Que souhaitez-vous faire aujourd&apos;hui ?
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          <motion.button
            variants={verticalFadeIn}
            onClick={() => router.push("/onboarding")}
            className="flex-1 group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 text-left hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="w-24 h-24 text-blue-600" />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Je suis une entreprise
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Trouvez un service de santé au travail et gérez vos obligations légales.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </motion.button>

          <motion.button
            variants={verticalFadeIn}
            onClick={() => router.push("/medical/register")}
            className="flex-1 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-500 p-8 text-left hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Stethoscope className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 text-white flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                Je suis un service de santé
              </h2>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                Référencez votre service et gérez vos adhésions d&apos;entreprises.
              </p>
              <div className="flex items-center text-white font-medium group-hover:translate-x-1 transition-transform">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

