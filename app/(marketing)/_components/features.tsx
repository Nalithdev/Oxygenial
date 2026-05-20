"use client";

import { motion } from "motion/react";
import { verticalFadeIn } from "@/lib/animations";
import { Search, FileCheck, Calendar, Users, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Matching intelligent",
    description: "Renseignez votre secteur, votre effectif et votre localisation. Oxygenial identifie les SPSTI les plus compatibles avec votre situation réelle.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: FileCheck,
    title: "Demandes qualifiées",
    description: "Votre dossier arrive structuré chez le SPSTI : raison sociale, secteur, effectif, besoins. Fini les échanges répétitifs pour reconstituer des informations de base.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Calendar,
    title: "Onboarding fluidifié",
    description: "Le processus d'adhésion se déclenche dans un environnement numérique structuré, sans ressaisie manuelle ni échange de documents papier.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Users,
    title: "Dashboard SPSTI",
    description: "Pilotez vos demandes entrantes, suivez votre attractivité et accédez aux analytics de votre activité sur la plateforme.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Shield,
    title: "Obligations légales claires",
    description: "Comprenez immédiatement vos obligations selon votre effectif et votre secteur, sans avoir besoin d'un expert RH pour les interpréter.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Zap,
    title: "Visibilité numérique",
    description: "Les SPSTI disposent d'une vitrine structurée et accessible, sans avoir à investir dans un site ou une stratégie SEO propre.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <motion.h2 variants={verticalFadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </motion.h2>
          <motion.p variants={verticalFadeIn} className="text-slate-600 text-lg">
            Des outils dédiés aux entreprises qui cherchent, et aux SPSTI qui accueillent.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={verticalFadeIn}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
