"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { verticalFadeIn } from "@/lib/animations";
import { ArrowRight, Building2, Stethoscope, Users } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50/50 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-50/30 blur-3xl rounded-full -z-10 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={verticalFadeIn} className="mb-6 flex justify-center">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium tracking-wide border border-blue-100">
              La mise en relation intelligente entre entreprises et SPSTI
            </span>
          </motion.div>

          <motion.h1
            variants={verticalFadeIn}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 text-balance"
          >
            Trouvez le bon service de santé au travail.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              En quelques minutes.
            </span>
          </motion.h1>

          <motion.p
            variants={verticalFadeIn}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Oxygenial qualifie votre besoin, identifie les SPSTI compatibles avec votre situation et vous met en relation avec les bons interlocuteurs sans formulaires longs, sans recherches dispersées, sans stress administratif.
          </motion.p>

          <motion.div
            variants={verticalFadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-blue-500/20">
              <Link href="/sign-up">
                <Building2 className="mr-2 h-4 w-4" />
                Trouver mon SPSTI
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 border-slate-200">
              <Link href="#features">
                Comment ça marche
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={verticalFadeIn}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
              </div>
              <span>SPSTI qualifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <span>Matching intelligent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-violet-600" />
              </div>
              <span>Demandes structurées</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
