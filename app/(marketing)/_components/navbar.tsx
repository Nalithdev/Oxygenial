"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { verticalFadeIn } from "@/lib/animations";
import { Stethoscope } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

export function Navbar() {

  const { data: session } = useSession();

  return (
    <motion.nav
      initial="initial"
      animate="animate"
      variants={verticalFadeIn}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Oxygenial</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#features" className="hover:text-primary transition-colors">
          Fonctionnalités
        </Link>
        <Link href="#about" className="hover:text-primary transition-colors">
          À propos
        </Link>
        <div className="h-4 w-px bg-slate-200" />
        <Link href="/medical/register" className="text-emerald-600 hover:text-emerald-700 transition-colors">
          Vous êtes un service de santé ?
        </Link>
      </div>

      {session?.user?.name ?
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button onClick={() => signOut()} asChild variant="ghost" size="sm">
            <p className="cursor-pointer">Se déconnecter</p>
          </Button>
        </div>
        :

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Se connecter</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Créer mon compte</Link>
          </Button>
        </div>
      }

    </motion.nav>
  );
}
