import React from 'react'
import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

interface LegalPageProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export const LegalPage: React.FC<LegalPageProps> = ({
  title,
  lastUpdated,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation légale */}
      <nav
        className="bg-white border-b border-slate-200 sticky top-0 z-40"
        aria-label="Navigation légale"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Oxygenial</span>
          </Link>

          <Link
            href="/legal"
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
          >
            ← Retour aux documents légaux
          </Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <header className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {lastUpdated}
          </p>
        </header>

        {/* Contenu avec styles de base */}
        <article className="prose prose-sm max-w-none">
          <div className="text-gray-700 space-y-6">{children}</div>
        </article>

        {/* Pied de page légal */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-600">
          <p>
            © 2026 Oxygenial. Tous les documents légaux sont disponibles sur
            cette page.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/legal/mentions-legales" className="text-blue-600 hover:underline">
              Mentions légales
            </Link>
            <span>•</span>
            <Link href="/legal/conditions-utilisation" className="text-blue-600 hover:underline">
              Conditions d&apos;utilisation
            </Link>
            <span>•</span>
            <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

// Composants pour les sections
interface SectionProps {
  title: string
  children: React.ReactNode
  id?: string
}

export const Section: React.FC<SectionProps> = ({ title, children, id }) => (
  <section id={id} className="mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
)

interface SubsectionProps {
  title: string
  children: React.ReactNode
}

export const Subsection: React.FC<SubsectionProps> = ({ title, children }) => (
  <div className="ml-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2 text-gray-700">{children}</div>
  </div>
)

export const Paragraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="text-gray-700 leading-relaxed">{children}</p>

export const BulletList: React.FC<{ items: React.ReactNode[] }> = ({
  items,
}) => (
  <ul className="list-disc pl-6 space-y-2 text-gray-700">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)

export const InformationBox: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
    <p className="text-sm text-blue-900">{children}</p>
  </div>
)
