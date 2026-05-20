import Link from 'next/link'
import {
  LegalPage,
  Section,
  Subsection,
  Paragraph,
  BulletList,
  InformationBox,
} from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Conditions d\'Utilisation - Oxygenial',
  description: 'Conditions générales d\'utilisation de la plateforme Oxygenial',
  robots: 'index, follow',
}

export default function ConditionsUtilisation() {
  return (
    <LegalPage title="Conditions d'Utilisation" lastUpdated="19 mai 2026">
      <InformationBox>
        <strong>Important :</strong> En créant un compte ou en utilisant la Plateforme, vous acceptez
        sans réserve les présentes conditions, ainsi que la Politique de Confidentialité.
      </InformationBox>

      <Section title="1. Accès et création de compte" id="acces">
        <Subsection title="Conditions d'accès">
          <p className="text-gray-700 font-semibold mb-2">Utilisation autorisée :</p>
          <BulletList
            items={[
              'La Plateforme est réservée aux professionnels et entités légales (entreprises, services de santé, institutions)',
              'Vous devez être majeur et légalement capable de conclure des contrats',
              'Votre utilisation doit être conforme aux lois applicables',
            ]}
          />

          <p className="text-gray-700 font-semibold mt-4 mb-2">Utilisation interdite :</p>
          <BulletList
            items={[
              'Usage personnel ou consommateur (B2C) non autorisé',
              'Usage par des mineurs sans autorisation d\'un représentant légal',
              'Accès par force brute, bots, ou scripts automatisés',
            ]}
          />
        </Subsection>

        <Subsection title="Création de compte">
          <p className="text-gray-700 font-semibold mb-2">Pour créer un compte, vous devez :</p>
          <BulletList
            items={[
              'Être dûment autorisé par votre organisation',
              'Fournir des informations exactes, complètes et à jour',
              'Accepter les conditions d\'utilisation et la politique de confidentialité',
            ]}
          />

          <p className="text-gray-700 font-semibold mt-4 mb-2">Responsabilité :</p>
          <p className="text-gray-700 mb-2">Vous êtes responsable de :</p>
          <BulletList
            items={[
              'La véracité des informations fournies',
              'La confidentialité de votre mot de passe',
              'Tous les accès à votre compte utilisant vos identifiants',
              'La notification immédiate de tout accès non autorisé',
            ]}
          />
        </Subsection>

        <Subsection title="Authentification et sécurité">
          <BulletList
            items={[
              'Mot de passe : minimum 12 caractères avec majuscules, chiffres et caractères spéciaux',
              'Authentification multi-facteurs (MFA) : recommandée',
              'Vous êtes responsable de conserver votre mot de passe confidentiel',
              'Vous déconnecter après chaque session',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="2. Services et fonctionnalités" id="services">
        <Subsection title="Services principaux">
          <p className="text-gray-700 font-semibold mb-2">Pour les entreprises :</p>
          <BulletList
            items={[
              'Consulter et comparer les services de santé au travail référencés',
              'Envoyer des demandes de mise en relation',
              'Planifier et suivre les rendez-vous médicaux des salariés',
              'Centraliser les documents administratifs et médicaux',
              'Suivi des obligations légales de santé au travail',
              'Alertes des échéances obligatoires',
            ]}
          />

          <p className="text-gray-700 font-semibold mt-4 mb-2">Pour les services de santé :</p>
          <BulletList
            items={[
              'Créer et gérer un profil de prestataire',
              'Gérer les demandes d\'adhésion d\'entreprises',
              'Gérer les rendez-vous et disponibilités',
              'Facturation et suivi des paiements',
              'Rapports et analytics d\'activité',
            ]}
          />
        </Subsection>

        <Subsection title="Limitations des services">
          <InformationBox>
            <strong>Important :</strong> Oxygenial n'est pas un prestataire de santé au travail.
            Oxygenial est un intermédiaire technologique facilitant la mise en relation entre
            entreprises et services de santé.
          </InformationBox>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Oxygenial n'est pas responsable de :</p>
          <BulletList
            items={[
              'La qualité ou la disponibilité des services de santé proposés',
              'Les actes médicaux ou diagnostics',
              'La compétence des praticiens',
              'Les manquements des prestataires aux obligations légales',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="3. Utilisation responsable et interdictions" id="utilistion-responsable">
        <Subsection title="Utilisation responsable">
          <p className="text-gray-700 font-semibold mb-2">Vous vous engagez à :</p>
          <BulletList
            items={[
              'Respecter la loi française, européenne, et les lois applicables',
              'Respecter le Code du travail et la confidentialité des données',
              'Utiliser la Plateforme uniquement à des fins professionnelles légitimes',
              'Ne pas usurper l\'identité d\'autrui',
              'Fournir des données exactes et à jour',
            ]}
          />
        </Subsection>

        <Subsection title="Interdictions absolues">
          <p className="text-gray-700 font-semibold mb-2">Il est expressément interdit de :</p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Activités illégales</h4>
              <BulletList
                items={[
                  'Commettre des actes illégaux ou encourager la fraude',
                  'Usurpation d\'identité ou escroquerie',
                  'Transmission de malveillances (virus, chevaux de Troie)',
                ]}
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Accès non autorisé</h4>
              <BulletList
                items={[
                  'Tentatives d\'accès non autorisé au système',
                  'Utilisation de robots, scrapers ou crawlers',
                  'Reverse engineering du code',
                ]}
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Données d\'autrui</h4>
              <BulletList
                items={[
                  'Collecter ou utiliser les données personnelles sans consentement',
                  'Violation du secret professionnel médical',
                  'Partage non autorisé de données sensibles',
                ]}
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Contenu inapproprié</h4>
              <BulletList
                items={[
                  'Contenu offensant, discriminatoire ou haineux',
                  'Contenu sexuel ou violent',
                  'Partage de propriété intellectuelle d\'autrui sans autorisation',
                ]}
              />
            </div>
          </div>
        </Subsection>
      </Section>

      <Section title="4. Données et propriété intellectuelle" id="donnees">
        <Subsection title="Données de l'utilisateur">
          <BulletList
            items={[
              'Vous conservez la propriété de toutes les données que vous créez et chargez',
              'Oxygenial obtient une licence pour stocker et traiter vos données',
              'Seuls vous et vos collaborateurs autorisés accédez à vos données',
              'Oxygenial accède uniquement pour maintenance et sécurité',
            ]}
          />
        </Subsection>

        <Subsection title="Propriété intellectuelle d'Oxygenial">
          <p className="text-gray-700">
            Le code source, design, interface, logos et marques d'Oxygenial restent la propriété
            exclusive de l'éditeur. Vous recevez une licence personnelle, non-transférable et
            révocable d'utilisation.
          </p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Interdictions :</p>
          <BulletList
            items={[
              'Reproduire, copier ou modifier la Plateforme',
              'Décompiler ou reverse-engineer le code source',
              'Créer des œuvres dérivées ou concurrentes',
              'Transférer ou vendre l\'accès',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="5. Responsabilité et limitation" id="responsabilite">
        <Subsection title="Responsabilité d'Oxygenial">
          <p className="text-gray-700 font-semibold mb-2">Oxygenial est responsable de :</p>
          <BulletList
            items={[
              'Fournir l\'infrastructure technique et le service',
              'Maintenir la disponibilité raisonnable de la Plateforme',
              'Protéger les données selon les standards de sécurité applicables',
              'Respecter les droits RGPD',
            ]}
          />

          <p className="text-gray-700 font-semibold mt-4 mb-2">Oxygenial n'est PAS responsable de :</p>
          <BulletList
            items={[
              'Qualité ou fiabilité des services de santé proposés',
              'Actes médicaux ou résultats cliniques',
              'Perte de données due à erreur utilisateur',
              'Interruptions dues à force majeure',
            ]}
          />
        </Subsection>

        <Subsection title="Limitation de responsabilité">
          <InformationBox>
            <strong>Limitation financière :</strong> La responsabilité totale d'Oxygenial ne
            pourra pas dépasser le montant de l'abonnement payé au cours des 12 derniers mois,
            dans la limite de 10 000 euros.
          </InformationBox>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Exclusions :</p>
          <p className="text-gray-700 mb-2">Oxygenial n'est pas responsable de :</p>
          <BulletList
            items={[
              'Pertes de bénéfices ou d\'activité',
              'Pertes de revenus ou de clients',
              'Dommages commerciaux ou moraux',
              'Dommages immatériels ou économiques',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="6. Confidentialité et secret médical" id="confidentialite">
        <Subsection title="Secret médical">
          <Paragraph>
            Les données relatives à la santé sont couvertes par le secret professionnel médical.
            Seules les personnes autorisées par la loi et le patient peuvent y accéder. Toute
            violation est pénalement sanctionnée.
          </Paragraph>
        </Subsection>

        <Subsection title="Confidentialité entre utilisateurs">
          <BulletList
            items={[
              'Les entreprises et services de santé ne doivent pas partager les données de l\'autre sans autorisation',
              'Les messages via Plateforme restent confidentiels',
              'Oxygenial ne divulgue pas les données d\'un utilisateur à un autre',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="7. Modification des conditions" id="modifications">
        <Subsection title="Droit de modifier">
          <Paragraph>
            Oxygenial se réserve le droit de modifier les présentes conditions à tout moment pour
            se conformer aux changements légaux, améliorer la sécurité ou clarifier les obligations.
          </Paragraph>
        </Subsection>

        <Subsection title="Notification">
          <BulletList
            items={[
              'Modifications substantielles : notification 30 jours avant',
              'Acceptation requise avant continuation',
              'Droit de résilier sans pénalité si refus',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="8. Support et signalements" id="support">
        <Subsection title="Support utilisateur">
          <div className="space-y-2 text-gray-700">
            <p><strong>Email :</strong> support@oxygenial.lunark.dev</p>
            <p><strong>Disponibilité :</strong> Lundi-vendredi, 9h-18h (Paris)</p>
            <p><strong>Temps de réponse :</strong> 48 heures ouvrables</p>
          </div>
        </Subsection>

        <Subsection title="Signalement de contenu">
          <div className="space-y-2 text-gray-700">
            <p><strong>Email :</strong> moderation@oxygenial.lunark.dev</p>
            <p><strong>Délai :</strong> Traitement dans les 24 heures</p>
          </div>
        </Subsection>

        <Subsection title="Signalement RGPD">
          <div className="space-y-2 text-gray-700">
            <p><strong>Email DPO :</strong> dpo@oxygenial.lunark.dev</p>
          </div>
        </Subsection>
      </Section>

      <Section title="9. Droit applicable et juridiction" id="droit">
        <BulletList
          items={[
            'Droit applicable : Droit français',
            'Résolution amiable prioritaire via discussion/médiation',
            'Compétence des tribunaux français',
            'Droit de recours auprès de la CNIL pour données personnelles',
          ]}
        />
      </Section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">
          En créant un compte ou utilisant la Plateforme, vous déclarez avoir lu et accepté les
          présentes conditions d'utilisation.
        </p>
        <p className="text-sm text-gray-600">
          Consultez aussi notre{' '}
          <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
            Politique de Confidentialité
          </Link>
          {' '}et les{' '}
          <Link href="/legal/mentions-legales" className="text-blue-600 hover:underline">
            Mentions Légales
          </Link>
          .
        </p>
      </div>
    </LegalPage>
  )
}
