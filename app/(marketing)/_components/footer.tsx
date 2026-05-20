import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Medli'</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
                Comprenez vos obligations, identifiez les SPSTI compatibles avec votre secteur et votre localisation, et initiez votre démarche d'adhésion en quelques minutes sans expertise RH requise.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Entreprises</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/sign-up" className="hover:text-white transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Fonctionnalités
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services de Santé</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/medical/register" className="hover:text-white transition-colors">
                  Rejoindre Medli'
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">
                  Espace professionnel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Medli'. Tous droits réservés.
          </div>
            <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-500">
                <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                <Link href="/legal/conditions-utilisation" className="hover:text-white transition-colors">Conditions d’utilisation</Link>
                <Link href="/legal/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
