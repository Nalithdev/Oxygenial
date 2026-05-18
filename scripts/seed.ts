import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { hashPassword, generateRandomString } from 'better-auth/crypto';
import * as schema from '../db/schema/global';

const database = drizzle(process.env.DATABASE_URL!, { schema });

interface CreatedUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

const createdUsers: CreatedUser[] = [];

async function createUser(
  email: string,
  password: string,
  name: string,
  role: string,
) {
  const userId = generateRandomString(32, 'a-z', 'A-Z', '0-9');
  const hashedPassword = await hashPassword(password);

  await database.insert(schema.user).values({
    id: userId,
    email,
    name,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await database.insert(schema.account).values({
    id: generateRandomString(32, 'a-z', 'A-Z', '0-9'),
    userId,
    accountId: userId,
    providerId: 'credential',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  createdUsers.push({ id: userId, email, password, name, role });

  return userId;
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  console.log('🏥 Creating medical companies...');
  const [medicalCompany1] = await database
    .insert(schema.medicalCompaniesTable)
    .values({
      name: 'Santé Plus Île-de-France',
      description:
        "Service de santé au travail interentreprises couvrant toute l'Île-de-France. Spécialisé dans l'accompagnement des TPE et PME.",
      address: '15 rue de la Santé',
      postalCode: '75014',
      city: 'Paris',
      phone: '01 23 45 67 89',
      email: 'contact@santeplus-idf.fr',
      website: 'https://santeplus-idf.fr',
      sectors: 'BTP,Industrie,Commerce,Services',
      coveragePostalCodes: '75,77,78,91,92,93,94,95',
    })
    .returning();

  const [medicalCompany2] = await database
    .insert(schema.medicalCompaniesTable)
    .values({
      name: 'MedTravail Lyon',
      description:
        'Centre de médecine du travail moderne et innovant. Équipe pluridisciplinaire à votre service.',
      address: '42 avenue Jean Jaurès',
      postalCode: '69007',
      city: 'Lyon',
      phone: '04 56 78 90 12',
      email: 'contact@medtravail-lyon.fr',
      website: 'https://medtravail-lyon.fr',
      sectors: 'Restauration,Santé,Transport,Artisanat',
      coveragePostalCodes: '69,01,38,42',
    })
    .returning();

  console.log(`   ✓ Created: ${medicalCompany1.name}`);
  console.log(`   ✓ Created: ${medicalCompany2.name}`);

  console.log('\n👨‍⚕️ Creating medical staff users...');

  const medicalAdmin1Id = await createUser(
    'admin@santeplus-idf.fr',
    'password123',
    'Dr. Marie Dupont',
    'Medical Admin',
  );

  const medicalDoctor1Id = await createUser(
    'docteur@santeplus-idf.fr',
    'password123',
    'Dr. Jean Martin',
    'Medical Doctor',
  );

  const medicalAdmin2Id = await createUser(
    'admin@medtravail-lyon.fr',
    'password123',
    'Dr. Sophie Bernard',
    'Medical Admin',
  );

  await database.insert(schema.medicalStaffTable).values([
    {
      userId: medicalAdmin1Id,
      medicalCompanyId: medicalCompany1.id,
      role: 'admin',
    },
    {
      userId: medicalDoctor1Id,
      medicalCompanyId: medicalCompany1.id,
      role: 'doctor',
    },
    {
      userId: medicalAdmin2Id,
      medicalCompanyId: medicalCompany2.id,
      role: 'admin',
    },
  ]);

  console.log('\n🏢 Creating client companies...');

  const [clientCompany1] = await database
    .insert(schema.clientCompaniesTable)
    .values({
      name: 'TechStart SAS',
      siret: '12345678901234',
      address: "10 rue de l'Innovation",
      postalCode: '75011',
      city: 'Paris',
      sector: 'Services',
      employeeCount: 25,
      medicalCompanyId: medicalCompany1.id,
      onboardingStatus: 'completed',
    })
    .returning();

  const [clientCompany2] = await database
    .insert(schema.clientCompaniesTable)
    .values({
      name: 'Boulangerie Martin',
      siret: '98765432109876',
      address: '5 place du Marché',
      postalCode: '69003',
      city: 'Lyon',
      sector: 'Artisanat',
      employeeCount: 8,
      medicalCompanyId: medicalCompany2.id,
      onboardingStatus: 'completed',
    })
    .returning();

  const [clientCompany3] = await database
    .insert(schema.clientCompaniesTable)
    .values({
      name: 'Construction Leblanc',
      siret: '45678901234567',
      address: 'Zone Industrielle Nord',
      postalCode: '92100',
      city: 'Boulogne-Billancourt',
      sector: 'BTP',
      employeeCount: 45,
      onboardingStatus: 'search_medical',
    })
    .returning();

  console.log(
    `   ✓ Created: ${clientCompany1.name} (member of ${medicalCompany1.name})`,
  );
  console.log(
    `   ✓ Created: ${clientCompany2.name} (member of ${medicalCompany2.name})`,
  );
  console.log(`   ✓ Created: ${clientCompany3.name} (not yet member)`);

  console.log('\n👥 Creating company admins and employees...');

  const companyAdmin1Id = await createUser(
    'admin@techstart.fr',
    'password123',
    'Pierre Durand',
    'Company Admin (TechStart)',
  );

  const employee1Id = await createUser(
    'alice@techstart.fr',
    'password123',
    'Alice Moreau',
    'Employee (TechStart)',
  );

  const employee2Id = await createUser(
    'bob@techstart.fr',
    'password123',
    'Bob Petit',
    'Employee (TechStart)',
  );

  const companyAdmin2Id = await createUser(
    'martin@boulangerie-martin.fr',
    'password123',
    'François Martin',
    'Company Admin (Boulangerie)',
  );

  const employee3Id = await createUser(
    'julie@boulangerie-martin.fr',
    'password123',
    'Julie Roux',
    'Employee (Boulangerie)',
  );

  const companyAdmin3Id = await createUser(
    'leblanc@construction-leblanc.fr',
    'password123',
    'Marc Leblanc',
    'Company Admin (Construction - Onboarding)',
  );

  const [emp1] = await database
    .insert(schema.employeesTable)
    .values([
      {
        userId: companyAdmin1Id,
        clientCompanyId: clientCompany1.id,
        role: 'company_admin',
        position: 'Directeur Général',
      },
      {
        userId: employee1Id,
        clientCompanyId: clientCompany1.id,
        role: 'employee',
        position: 'Développeur Senior',
      },
      {
        userId: employee2Id,
        clientCompanyId: clientCompany1.id,
        role: 'employee',
        position: 'Designer UX',
      },
      {
        userId: companyAdmin2Id,
        clientCompanyId: clientCompany2.id,
        role: 'company_admin',
        position: 'Gérant',
      },
      {
        userId: employee3Id,
        clientCompanyId: clientCompany2.id,
        role: 'employee',
        position: 'Boulanger',
      },
      {
        userId: companyAdmin3Id,
        clientCompanyId: clientCompany3.id,
        role: 'company_admin',
        position: 'Directeur',
      },
    ])
    .returning();

  const employees = await database.query.employeesTable.findMany();

  console.log('\n📋 Creating membership request...');

  await database.insert(schema.membershipRequestsTable).values({
    clientCompanyId: clientCompany3.id,
    medicalCompanyId: medicalCompany1.id,
    status: 'pending',
    message:
      'Bonjour, nous sommes une entreprise de construction de 45 employés. Nous recherchons un service de santé au travail fiable pour nos équipes travaillant sur différents chantiers en Île-de-France.',
  });

  console.log(
    `   ✓ Created pending request: ${clientCompany3.name} → ${medicalCompany1.name}`,
  );

  console.log('\n📅 Creating bookings...');

  const techstartEmployees = employees.filter(
    (e) => e.clientCompanyId === clientCompany1.id,
  );
  const boulangerieEmployees = employees.filter(
    (e) => e.clientCompanyId === clientCompany2.id,
  );

  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 7);
  futureDate1.setHours(10, 0, 0, 0);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 14);
  futureDate2.setHours(14, 30, 0, 0);

  const pastDate1 = new Date();
  pastDate1.setDate(pastDate1.getDate() - 30);
  pastDate1.setHours(9, 0, 0, 0);

  await database.insert(schema.bookingsTable).values([
    {
      employeeId: techstartEmployees[1]?.id ?? 1,
      medicalCompanyId: medicalCompany1.id,
      scheduledAt: futureDate1,
      status: 'scheduled',
      notes: 'Visite médicale annuelle',
    },
    {
      employeeId: techstartEmployees[2]?.id ?? 2,
      medicalCompanyId: medicalCompany1.id,
      scheduledAt: futureDate2,
      status: 'scheduled',
      notes: 'Visite de reprise après arrêt maladie',
    },
    {
      employeeId: techstartEmployees[1]?.id ?? 1,
      medicalCompanyId: medicalCompany1.id,
      scheduledAt: pastDate1,
      status: 'completed',
      notes: "Visite d'embauche",
    },
    {
      employeeId: boulangerieEmployees[1]?.id ?? 4,
      medicalCompanyId: medicalCompany2.id,
      scheduledAt: futureDate1,
      status: 'scheduled',
      notes: 'Visite périodique',
    },
  ]);

  console.log(
    '   ✓ Created 4 bookings (2 upcoming, 1 completed, 1 for boulangerie)',
  );

  console.log('\n📄 Creating documents...');

  await database.insert(schema.documentsTable).values([
    {
      employeeId: techstartEmployees[1]?.id ?? 1,
      name: "Fiche d'aptitude - Janvier 2024",
      type: 'aptitude',
      url: 'https://example.com/documents/aptitude-2024.pdf',
    },
    {
      employeeId: techstartEmployees[1]?.id ?? 1,
      name: 'Attestation de suivi médical',
      type: 'certificat',
      url: 'https://example.com/documents/attestation-suivi.pdf',
    },
    {
      employeeId: boulangerieEmployees[1]?.id ?? 4,
      name: "Certificat médical d'aptitude",
      type: 'aptitude',
      url: 'https://example.com/documents/certificat-boulanger.pdf',
    },
  ]);

  console.log('   ✓ Created 3 documents');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Database seeded successfully!');
  console.log('='.repeat(60));
  console.log('\n📧 Test Credentials:\n');

  for (const user of createdUsers) {
    console.log(`   ${user.role}:`);
    console.log(`     Email: ${user.email}`);
    console.log(`     Password: ${user.password}`);
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('\n💡 Quick access:');
  console.log('   - Medical Dashboard: Login as admin@santeplus-idf.fr');
  console.log('   - Company Dashboard: Login as admin@techstart.fr');
  console.log('   - Employee View: Login as alice@techstart.fr');
  console.log('   - Onboarding Flow: Login as leblanc@construction-leblanc.fr');
  console.log('');

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
