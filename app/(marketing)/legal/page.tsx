import {
  LegalPage,
  Section,
  Subsection,
  Paragraph,
  BulletList,
  InformationBox,
} from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Documents Légaux - Oxygenial',
  description: 'Mentions légales, conditions d\'utilisation et politique de confidentialité',
  robots: 'index, follow',
}

export default function LegalIndex() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documents Légaux
          </h1>
          <p className="text-lg text-gray-600">
            Oxygenial - Plateforme SaaS B2B de services de santé au travail
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Card Mentions Légales */}
          <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Mentions Légales
            </h2>
            <p className="text-gray-600 mb-4">
              Identification de l'éditeur, propriété intellectuelle et
              informations légales relatives à la plateforme.
            </p>
            <a
              href="/legal/mentions-legales"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Lire plus →
            </a>
          </article>

          {/* Card Conditions d'Utilisation */}
          <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Conditions d'Utilisation
            </h2>
            <p className="text-gray-600 mb-4">
              Règles d'accès et d'utilisation de la plateforme, services
              proposés et responsabilités.
            </p>
            <a
              href="/legal/conditions-utilisation"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Lire plus →
            </a>
          </article>

          {/* Card Politique de Confidentialité */}
          <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Politique de Confidentialité
            </h2>
            <p className="text-gray-600 mb-4">
              Protection des données personnelles, droits RGPD et gestion de
              vos informations.
            </p>
            <a
              href="/legal/politique-confidentialite"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Lire plus →
            </a>
          </article>
        </div>

        {/* Informations supplémentaires */}
        <section className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            À propos de ces documents
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Conformité RGPD
              </h3>
              <p className="text-gray-700">
                Oxygenial respecte les obligations du Règlement Général sur la
                Protection des Données (RGPD) et de la loi française
                Informatique et Libertés. Consultez notre politique de
                confidentialité pour comprendre comment vos données sont
                traitées.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Contact légal
              </h3>
              <p className="text-gray-700">
                Pour toute question concernant ces documents ou vos droits,
                contactez-nous :
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email :</strong> contact@oxygenial.lunark.dev
                <br />
                <strong>DPO :</strong> dpo@oxygenial.lunark.dev
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Dernière mise à jour
              </h3>
              <p className="text-gray-700">19 mai 2026</p>
            </div>
          </div>
        </section>

        {/* Links Footer */}
        <footer className="border-t border-gray-200 pt-8 flex justify-center gap-6 text-sm">
          <a href="/legal/mentions-legales" className="text-blue-600 hover:underline">
            Mentions légales
          </a>
          <span className="text-gray-300">•</span>
          <a href="/legal/conditions-utilisation" className="text-blue-600 hover:underline">
            Conditions d'utilisation
          </a>
          <span className="text-gray-300">•</span>
          <a href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
            Politique de confidentialité
          </a>
        </footer>
      </main>
    </div>
  )
}
