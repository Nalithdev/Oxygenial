"use client";

import { motion } from "motion/react";
import { verticalFadeIn } from "@/lib/animations";
import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="lg:w-1/2"
          >
            <motion.div variants={verticalFadeIn} className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium tracking-wide mb-6">
              Le contexte
            </motion.div>
            <motion.h2 variants={verticalFadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Un défi pour 1,1 million d&apos;entreprises
            </motion.h2>
            <motion.p variants={verticalFadeIn} className="text-slate-600 text-lg mb-8 leading-relaxed">
              Face à la complexité du marché et à la pénurie de médecins du travail (-21% depuis 2010),
              les dirigeants se sentent souvent démunis. Medli' a été créé pour répondre à ce besoin urgent.
            </motion.p>

            <motion.ul variants={verticalFadeIn} className="space-y-4">
              {[
                "Gain de temps précieux",
                "Conformité légale assurée",
                "Accès à un réseau vérifié",
                "Gestion administrative réduite"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

              <div className="relative z-10">
                <div className="text-6xl font-bold mb-2">1,1 M</div>
                <div className="text-xl font-medium text-blue-100 mb-8">TPE &amp; PME concernées</div>

                <div className="h-px bg-white/20 my-8" />

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-bold mb-1">-21%</div>
                    <div className="text-sm text-blue-100">de médecins disponibles</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1">100%</div>
                    <div className="text-sm text-blue-100">obligatoire</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
