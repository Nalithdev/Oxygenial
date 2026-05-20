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
  title: 'Politique de Confidentialité - Oxygenial',
  description: 'Protection des données personnelles et droits RGPD - Oxygenial',
  robots: 'index, follow',
}

export default function PolitiqueConfidentialite() {
  return (
    <LegalPage title="Politique de Confidentialité" lastUpdated="19 mai 2026">
      <InformationBox>
        <strong>RGPD :</strong> Oxygenial accorde une importance capitale à la protection de vos
        données personnelles. Cette politique explique comment nous collectons, utilisons,
        conservons et protégeons vos données conformément au RGPD et à la législation française.
      </InformationBox>

      <Section title="1. Responsable de traitement et DPO" id="responsable">
        <Subsection title="Responsable de traitement">
          <div className="space-y-2 text-gray-700">
            <p><strong>Nom :</strong> Oxygenial</p>
            <p><strong>Email :</strong> contact@oxygenial.lunark.dev</p>
            <p><strong>DPO (Délégué à la Protection des Données) :</strong> dpo@oxygenial.lunark.dev</p>
          </div>
        </Subsection>

        <Paragraph>
          Le Délégué à la Protection des Données assure la conformité aux obligations RGPD, traite
          les demandes d'exercice de droits et gère les incidents de sécurité.
        </Paragraph>
      </Section>

      <Section title="2. Données collectées et finalités" id="donnees">
        <Subsection title="Données des entreprises (utilisateurs)">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Identification et contact</h4>
              <BulletList
                items={[
                  'Raison sociale et SIRET/SIREN',
                  'Nom et prénom du responsable/administrateur',
                  'Email professionnel et numéro de téléphone',
                  'Adresse postale et secteur d\'activité',
                ]}
              />
              <p className="text-gray-700 text-sm mt-2">
                <strong>Finalité :</strong> Création et gestion du compte professionnel, facturation
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Données d'utilisation</h4>
              <BulletList
                items={[
                  'Adresse IP, type de navigateur',
                  'Pages consultées et durée de visite',
                  'Date/heure des connexions',
                  'Actions effectuées sur la plateforme',
                ]}
              />
              <p className="text-gray-700 text-sm mt-2">
                <strong>Finalité :</strong> Amélioration du service, détection de fraudes, maintenance
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Données de facturation</h4>
              <BulletList
                items={[
                  'Numéro de TVA et IBAN/coordonnées bancaires',
                  'Historique des transactions et factures',
                  'Détails d\'abonnement (plan, dates, renouvellement)',
                ]}
              />
              <p className="text-gray-700 text-sm mt-2">
                <strong>Finalité :</strong> Facturation, comptabilité, lutte contre la fraude
              </p>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Durée conservation :</strong> 10 ans (obligation fiscale)
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Données de rendez-vous</h4>
              <BulletList
                items={[
                  'Dates et heures des rendez-vous',
                  'Services demandés',
                  'Statut (confirmé, reporté, annulé)',
                  'Notes et commentaires entre parties',
                ]}
              />
              <p className="text-gray-700 text-sm mt-2">
                <strong>Durée conservation :</strong> Pendant le contrat + 2 ans après
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Données relatives aux salariés 🔒</h4>
              <BulletList
                items={[
                  'Identifiant unique (anonymisé ou pseudonymisé)',
                  'Initiales du nom et prénom, date de naissance',
                  'Poste/fonction, département',
                  'Statut de conformité des visites médicales',
                  'DONNÉES SENSIBLES : Informations de santé (limitations, recommandations)',
                  'Documents de suivi (certificats, rapports médicaux)',
                ]}
              />
              <p className="text-gray-700 text-sm mt-2">
                <strong>Finalité :</strong> Suivi conformité légale, gestion rendez-vous, stockage
                sécurisé des dossiers médicaux
              </p>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Durée conservation :</strong> Pendant le contrat + 5 ans après
              </p>
            </div>
          </div>
        </Subsection>

        <Subsection title="Données des services de santé">
          <BulletList
            items={[
              'Dénomination du service, SIRET/SIREN',
              'Numéro d\'agrément et qualifications',
              'Contact responsable, email, téléphone, adresse',
              'Spécialités et services proposés',
              'Nombre d\'entreprises adhérentes et performance',
              'Avis et commentaires clients',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="3. Destinataires des données" id="destinataires">
        <Subsection title="Destinataires internes">
          <BulletList
            items={[
              'Équipe support et administration',
              'Équipe facturation et comptabilité',
              'Équipe technique et sécurité informatique',
              'Direction générale',
            ]}
          />
        </Subsection>

        <Subsection title="Destinataires externes">
          <p className="text-gray-700 font-semibold mb-2">Prestataires techniques (sous-traitants) :</p>
          <BulletList
            items={[
              'Fournisseur d\'hébergement cloud',
              'Prestataire de paiement en ligne',
              'Prestataire de cybersécurité',
              'Prestataire d\'analytics',
            ]}
          />
          <p className="text-gray-700 text-sm mt-2">
            <strong>Garantie :</strong> Tous les sous-traitants ont signé des contrats conformes RGPD
            (article 28)
          </p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Autres destinataires :</p>
          <BulletList
            items={[
              'Les services de santé reçoivent les données des entreprises les contactant',
              'Les entreprises reçoivent les données des services acceptant leur demande',
              'Autorités publiques (si obligation légale)',
              'CNIL et organismes de contrôle',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="4. Localisation et sécurité des données" id="securite">
        <Subsection title="Localisation">
          <Paragraph>
            Les données sont hébergées au sein de l'Union Européenne. Aucun transfert en dehors
            de l'UE sans mécanismes de protection adéquate conformément à l'article 46 du RGPD.
          </Paragraph>
        </Subsection>

        <Subsection title="Mesures de sécurité">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Techniques</h4>
              <BulletList
                items={[
                  'Chiffrement SSL/TLS pour tous les transferts',
                  'Chiffrement AES-256 des données sensibles en base',
                  'Authentification multi-facteurs (MFA) disponible',
                  'Pare-feu et segmentation réseau',
                  'Antimalware en continu',
                  'Sauvegardes chiffrées régulières',
                ]}
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Organisationnelles</h4>
              <BulletList
                items={[
                  'Contrôle d\'accès basé sur les rôles',
                  'Clauses de confidentialité dans tous les contrats',
                  'Formation régulière à la sécurité et RGPD',
                  'Audits de sécurité et tests de pénétration',
                  'Procédure réactive d\'incident',
                ]}
              />
            </div>
          </div>
        </Subsection>

        <InformationBox>
          <strong>Limitation :</strong> Bien que nous mettons en œuvre des mesures robustes,
          aucun système n'est totalement impénétrable. En cas de violation de données, nous
          notifierons la CNIL dans les 72 heures.
        </InformationBox>
      </Section>

      <Section title="5. Vos droits RGPD" id="droits">
        <Paragraph>
          Vous disposez des droits suivants sur vos données personnelles (articles 15 à 22 RGPD) :
        </Paragraph>

        <Subsection title="Droit d'accès">
          <p className="text-gray-700">
            Droit d'obtenir une copie de l'ensemble de vos données personnelles. Délai de réponse :
            30 jours calendaires.
          </p>
        </Subsection>

        <Subsection title="Droit de rectification">
          <p className="text-gray-700">
            Droit de corriger les données inexactes ou incomplètes. Modifiez directement dans votre
            compte ou contactez dpo@oxygenial.lunark.dev.
          </p>
        </Subsection>

        <Subsection title="Droit à l'effacement (« Droit à l'oubli »)">
          <p className="text-gray-700 mb-2">Droit à la suppression dans certaines circonstances :</p>
          <BulletList
            items={[
              'Données collectées à titre excessif',
              'Données devenues inutiles',
              'Consentement révoqué',
              'Opposition au traitement acceptée',
            ]}
          />
          <p className="text-gray-700 text-sm mt-2">
            <strong>Exceptions :</strong> Obligations légales de conservation, contrats en cours,
            preuves de fraude
          </p>
        </Subsection>

        <Subsection title="Droit à la limitation du traitement">
          <p className="text-gray-700">
            Droit de demander le gel temporaire du traitement de vos données (lors de contestation
            d'exactitude, traitement illégal, ou données devenues inutiles).
          </p>
        </Subsection>

        <Subsection title="Droit à la portabilité">
          <p className="text-gray-700">
            Droit d'obtenir vos données dans un format structuré (CSV, JSON) et de les transmettre
            à un tiers, si collectées via consentement ou contrat.
          </p>
        </Subsection>

        <Subsection title="Droit d'opposition">
          <p className="text-gray-700">
            Droit de vous opposer au traitement de vos données, notamment pour marketing direct.
          </p>
        </Subsection>

        <Subsection title="Exercice de vos droits">
          <Paragraph>
            Pour exercer vos droits, contactez-nous :
          </Paragraph>
          <div className="bg-gray-50 p-4 rounded text-gray-700">
            <p><strong>Email DPO :</strong> dpo@oxygenial.lunark.dev</p>
            <p><strong>Délai :</strong> Réponse sous 30 jours</p>
          </div>
        </Subsection>
      </Section>

      <Section title="6. Données sensibles et santé au travail" id="donnees-sensibles">
        <Subsection title="Classification et restrictions d'accès">
          <p className="text-gray-700 mb-3">
            Les données relatives à la santé des salariés sont des <strong>données sensibles</strong>
            {' '}(article 9 RGPD) et nécessitent une protection renforcée.
          </p>
          <BulletList
            items={[
              'Employeur : Accès limité aux données de ses salariés',
              'Service de santé : Accès limité aux données dont il assure le suivi',
              'Personnel Oxygenial : Accès restreint en cas de support technique',
              'Données isolées et chiffrées en base',
            ]}
          />
        </Subsection>

        <Subsection title="Non-partage systématique">
          <BulletList
            items={[
              'Oxygenial ne vend pas les données de santé',
              'Aucune utilisation à des fins de profilage commercial',
              'Aucun partage avec tiers sans consentement explicite',
            ]}
          />
        </Subsection>

        <Subsection title="Conformité réglementaire">
          <BulletList
            items={[
              'Code du travail (L. 4624-1+) - secrets médicaux',
              'Code de la santé publique - secret professionnel médical',
              'RGPD article 9 - protection des données sensibles',
            ]}
          />
        </Subsection>
      </Section>

      <Section title="7. Durée de conservation" id="conservation">
        <div className="space-y-3 bg-gray-50 p-4 rounded">
          <div>
            <p className="font-semibold text-gray-800">Données d'identification et facturation</p>
            <p className="text-gray-700">Pendant la durée du contrat + 10 ans (obligation fiscale)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Données d'utilisation (logs, IP)</p>
            <p className="text-gray-700">6 mois après collecte</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Données de rendez-vous</p>
            <p className="text-gray-700">Pendant le contrat + 2 ans après résiliation</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Données de santé 🔒</p>
            <p className="text-gray-700">Pendant le contrat + 5 ans après (droit du travail)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Cookies et traceurs</p>
            <p className="text-gray-700">Voir Politique de Cookies (généralement 12 mois)</p>
          </div>
        </div>
      </Section>

      <Section title="8. Cookies et traceurs" id="cookies">
        <Paragraph>
          Un traitement détaillé des cookies est fourni dans notre{' '}
          <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
            Politique de Cookies
          </Link>
          .
        </Paragraph>

        <p className="text-gray-700 font-semibold mt-4 mb-2">Résumé :</p>
        <BulletList
          items={[
            'Cookies essentiels (obligatoires) : Session utilisateur, sécurité - sans consentement',
            'Cookies analytiques (consentement requis) : Amélioration du service',
            'Cookies publicitaires (consentement requis) : Suivi de campagnes marketing',
            'Banneau de consentement au premier chargement',
            'Centre de préférences accessible en pied de page',
          ]}
        />
      </Section>

      <Section title="9. Incidents de sécurité et violations" id="incidents">
        <Subsection title="Notification d'incident">
          <p className="text-gray-700 mb-3">
            En cas de violation de vos données (accès non autorisé, perte, corruption) :
          </p>
          <BulletList
            items={[
              'Oxygenial notifie la CNIL dans les 72 heures',
              'Information sans délai injustifié si risque probable pour vos droits',
              'Communication de : nature violation, données affectées, mesures prises',
            ]}
          />
        </Subsection>

        <Subsection title="Signalement d'incident">
          <p className="text-gray-700 font-semibold mb-2">Email :</p>
          <p className="text-gray-700">security@oxygenial.lunark.dev</p>
        </Subsection>

        <Subsection title="Recours auprès de la CNIL">
          <p className="text-gray-700 mb-2">
            Vous avez le droit de porter plainte auprès de :
          </p>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 font-mono">
            <p>CNIL (Commission Nationale de l'Informatique et des Libertés)</p>
            <p>3 Place de Fontenoy</p>
            <p>75007 Paris, France</p>
            <p>plainte@cnil.fr</p>
          </div>
        </Subsection>
      </Section>

      <Section title="10. Consentement et bases légales" id="consentement">
        <p className="text-gray-700 font-semibold mb-3">Pour chaque traitement, nous utilisons une base légale :</p>

        <div className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded text-sm">
          <p><strong>Contrat d'abonnement :</strong> Article 6.1.b RGPD (exécution du contrat)</p>
          <p><strong>Données d'utilisation :</strong> Article 6.1.f RGPD (intérêt légitime)</p>
          <p><strong>Données de santé :</strong> Article 9.2.a RGPD + consentement explicite</p>
          <p><strong>Suivi conformité :</strong> Article 6.1.c RGPD (obligation légale)</p>
          <p><strong>Marketing :</strong> Article 6.1.a RGPD (consentement)</p>
        </div>

        <p className="text-gray-700 mt-4">
          <strong>Consentement :</strong> Vous pouvez à tout moment modifier vos préférences ou
          révoquer votre consentement en contactant dpo@oxygenial.lunark.dev
        </p>
      </Section>

      <Section title="11. Utilisation par les salariés" id="salaries">
        <Subsection title="Transparence">
          <p className="text-gray-700 mb-2">
            Si vous êtes salarié dans une entreprise utilisant Oxygenial, l'entreprise (employeur)
            doit vous informer :
          </p>
          <BulletList
            items={[
              'Que vos données de santé sont stockées via cette plateforme',
              'Des données collectées (dates de visite, limitations, etc.)',
              'De vos droits RGPD',
            ]}
          />
        </Subsection>

        <Subsection title="Vos droits">
          <p className="text-gray-700">
            En tant que salarié, vous avez le droit de demander l'accès à vos données via votre
            employeur ou directement auprès du DPO : dpo@oxygenial.lunark.dev
          </p>
        </Subsection>
      </Section>

      <Section title="12. Modifications de cette politique" id="modifications">
        <Paragraph>
          Oxygenial se réserve le droit de modifier cette politique pour se conformer aux
          changements légaux ou améliorer la protection des données. Les modifications
          substantielles seront notifiées 30 jours avant, et l'utilisation continue implique
          l'acceptation.
        </Paragraph>
      </Section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Dernière mise à jour :</strong> 19 mai 2026
        </p>
        <p className="text-sm text-gray-600">
          Consultez aussi nos{' '}
          <Link href="/legal/conditions-utilisation" className="text-blue-600 hover:underline">
            Conditions d'Utilisation
          </Link>
          {' '}et nos{' '}
          <Link href="/legal/mentions-legales" className="text-blue-600 hover:underline">
            Mentions Légales
          </Link>
          .
        </p>
      </div>
    </LegalPage>
  )
}
