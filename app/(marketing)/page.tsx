"use client";

import { PageTransition } from "@/components/animations";
import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { About } from "./_components/about";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";
export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <About />
          <CTA />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
