import Link from 'next/link'
import {
    LegalPage,
    Section,
    Subsection,
    Paragraph,
    BulletList
} from '@/components/legal/legalPage'

export const metadata = {
    title: 'Mentions Légales - Medli',
    description: 'Informations légales et identification de la plateforme Medli',
    robots: 'index, follow',
}

export default function MentionsLegales() {
    return (
        <LegalPage title="Mentions Légales" lastUpdated="19 mai 2026">
            <Section title="Mentions légales">
                <Subsection title="Éditeur du site">
                    <Paragraph>
                        Le site Medli' est édité dans le cadre d’un projet pédagogique réalisé au sein du Mastère Management de la Transformation Digitale / Ingénierie Web & Innovations Digitales de l’IIM Digital School.
                    </Paragraph>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Nom du projet :</strong> Medli'</p>
                        <p><strong>Responsables du projet :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Anthony Lopes</li>
                            <li>Jade Kakonyi</li>
                            <li>Yovine Raghunandan</li>
                            <li>Lauriane Lamour</li>
                            <li>Michel Moccand-Jacquet</li>
                        </ul>
                        <p><strong>Adresse de contact :</strong> contact@Medli'.app</p>
                    </div>
                    <Paragraph>
                        Le site est actuellement développé dans le cadre d’un projet académique et ne constitue pas à ce jour une société immatriculée.
                    </Paragraph>
                </Subsection>

                <Subsection title="Hébergement">
                    <Paragraph>
                        Le site Medli' est hébergé par :
                    </Paragraph>
                    <div className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded">
                        <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                        <p>440 N Barranca Ave #4133</p>
                        <p>Covina, CA 91723</p>
                        <p>États-Unis</p>
                        <p>
                            <a href="https://vercel.com" className="text-blue-600 hover:underline">
                                https://vercel.com
                            </a>
                        </p>
                    </div>
                    <Paragraph>
                        Les données associées à la plateforme peuvent être hébergées via des services cloud compatibles PostgreSQL tels que Supabase ou Neon.
                    </Paragraph>
                </Subsection>

                <Subsection title="Propriété intellectuelle">
                    <Paragraph>
                        L’ensemble des contenus présents sur le site Medli', incluant notamment les textes, éléments graphiques, logos, maquettes, illustrations, interfaces, composants UI, bases de données, ainsi que l’architecture générale du site, sont protégés par les dispositions du Code de la propriété intellectuelle.
                    </Paragraph>
                    <Paragraph>
                        Toute reproduction, représentation, modification, publication, adaptation ou exploitation partielle ou totale des contenus du site, quel que soit le procédé utilisé, sans autorisation écrite préalable, est interdite.
                    </Paragraph>
                </Subsection>

                <Subsection title="Limitation de responsabilité">
                    <Paragraph>
                        Medli' agit comme une plateforme numérique d’intermédiation permettant aux entreprises d’identifier et de contacter des Services de Prévention et de Santé au Travail Interentreprises.
                    </Paragraph>
                    <Paragraph>
                        Medli' n’est pas un organisme médical, un SPSTI, un service de téléconsultation, ni un professionnel de santé.
                    </Paragraph>
                    <Paragraph>
                        Les informations présentes sur la plateforme sont fournies à titre informatif. Malgré le soin apporté à leur mise à jour, Medli' ne garantit pas l’exactitude, l’exhaustivité ou l’actualité permanente des informations diffusées.
                    </Paragraph>
                    <Paragraph>
                        La responsabilité d’Medli' ne pourra être engagée en cas :
                    </Paragraph>
                    <BulletList
                        items={[
                            'd’erreurs ou omissions dans les contenus',
                            'd’indisponibilité temporaire du service',
                            'de dysfonctionnement technique',
                            'de dommages indirects liés à l’utilisation de la plateforme',
                            'ou de décisions prises par les utilisateurs sur la base des informations présentes sur le site.',
                        ]}
                    />
                </Subsection>
            </Section>

            <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Vous pouvez également consulter nos{' '}
                    <Link href="/legal/conditions-utilisation" className="text-blue-600 hover:underline">
                        Conditions d'utilisation
                    </Link>
                    {' '}et notre{' '}
                    <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
                        Politique de confidentialité
                    </Link>
                    .
                </p>
            </div>
        </LegalPage>
    )
}
