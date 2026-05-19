import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { medicalCompaniesTable, medicalStaffTable, clientCompaniesTable, employeesTable, membershipRequestsTable, bookingsTable, documentsTable } from './db/schema/global';
import { user } from './db/schema/auth'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const DATABASE_URL =
    process.env.DATABASE_URL ?? '';

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const randDate = (daysBack: number) => {
    const d = new Date();
    d.setDate(d.getDate() - randInt(0, daysBack));
    return d;
};
const futureDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + randInt(1, daysAhead));
    return d;
};
const uid = () => crypto.randomUUID();

// ─── FAKE DATA ───────────────────────────────────────────────────────────────
const FIRST_NAMES = [
    'Alice', 'Bob', 'Claire', 'David', 'Emma', 'François', 'Gabrielle',
    'Hugo', 'Inès', 'Julien', 'Karine', 'Luc', 'Marie', 'Nicolas', 'Océane',
    'Pierre', 'Rania', 'Simon', 'Théo', 'Valentina',
];
const LAST_NAMES = [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand',
    'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia',
    'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
];
const CITIES = [
    'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes', 'Toulouse',
    'Strasbourg', 'Lille', 'Nice', 'Montpellier',
];
const POSTAL_CODES: Record<string, string> = {
    Paris: '75001', Lyon: '69001', Marseille: '13001', Bordeaux: '33000',
    Nantes: '44000', Toulouse: '31000', Strasbourg: '67000', Lille: '59000',
    Nice: '06000', Montpellier: '34000',
};
const SECTORS = [
    'BTP', 'Informatique', 'Santé', 'Finance', 'Commerce',
    'Industrie', 'Transport', 'Agriculture', 'Éducation', 'Hôtellerie',
];
const MEDICAL_COMPANY_NAMES = [
    'MédiSanté Pro', 'Centre Santé Plus', 'SantéWork Solutions',
    'MédiTravail Île-de-France', 'ProSanté Entreprises',
    'Clinique du Travail Lyon', 'SantéBiz Bordeaux',
    'MédiCorp Nantes', 'OccupaSanté Toulouse', 'PréventionPro Lille',
];
const CLIENT_COMPANY_NAMES = [
    'TechVision SAS', 'BâtiGroup', 'LogiTrans SARL', 'FinTech Conseil',
    'EduFormation SA', 'AgriCoop', 'HôtelLux', 'CommerceNet',
    'IndustroPro', 'DataSolutions', 'GreenEnergy', 'MobilApp',
    'RetailChain', 'SecureIT', 'FoodService',
];
const DOC_TYPES = [
    'Fiche d\'aptitude', 'Visite médicale', 'Déclaration d\'accident',
    'Bilan de santé', 'Attestation', 'Rapport médical',
];
const POSITIONS = [
    'Développeur', 'Chef de projet', 'Comptable', 'Directeur',
    'Commercial', 'RH', 'Technicien', 'Infirmier', 'Secrétaire', 'Juriste',
];

const randName = () =>
    `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
const randEmail = (name: string, i: number) =>
    `${name.toLowerCase().replace(/[^a-z]/g, '.')}.${i}@example.com`;

// ─── SEED ────────────────────────────────────────────────────────────────────
async function seed() {
    console.log('🌱 Starting seed...\n');

    // ── 1. Users ──────────────────────────────────────────────────────────────
    console.log('👤 Creating users...');

    // 30 medical-staff users + 50 employee users = 80 users total
    const MEDICAL_USER_COUNT = 30;
    const EMPLOYEE_USER_COUNT = 50;

    const allUserRows: typeof user.$inferInsert[] = [];

    for (let i = 0; i < MEDICAL_USER_COUNT + EMPLOYEE_USER_COUNT; i++) {
        const name = randName();
        allUserRows.push({
            id: uid(),
            name,
            email: randEmail(name, i),
            emailVerified: Math.random() > 0.2,
            image: null,
            createdAt: randDate(365),
            updatedAt: randDate(30),
        });
    }

    await db.insert(user).values(allUserRows);
    console.log(`   ✓ ${allUserRows.length} users created`);

    const medicalUserIds = allUserRows.slice(0, MEDICAL_USER_COUNT).map(u => u.id);
    const employeeUserIds = allUserRows.slice(MEDICAL_USER_COUNT).map(u => u.id);

    // ── 2. Medical companies ──────────────────────────────────────────────────
    console.log('🏥 Creating medical companies...');
    const medicalCompanyRows: typeof medicalCompaniesTable.$inferInsert[] =
        MEDICAL_COMPANY_NAMES.map((name, i) => {
            const city = CITIES[i % CITIES.length];
            return {
                name,
                description: `Cabinet de médecine du travail spécialisé à ${city}.`,
                address: `${randInt(1, 200)} rue de la Santé`,
                postalCode: POSTAL_CODES[city],
                city,
                phone: `0${randInt(1, 9)}${Array.from({ length: 8 }, () => randInt(0, 9)).join('')}`,
                email: `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.fr`,
                website: `https://www.${name.toLowerCase().replace(/[^a-z]/g, '')}.fr`,
                sectors: pick(SECTORS),
                coveragePostalCodes: [POSTAL_CODES[city], POSTAL_CODES[pick(CITIES)]].join(','),
                createdAt: randDate(730),
                updatedAt: randDate(90),
            };
        });

    const insertedMedical = await db
        .insert(medicalCompaniesTable)
        .values(medicalCompanyRows)
        .returning({ id: medicalCompaniesTable.id });
    const medicalIds = insertedMedical.map(r => r.id);
    console.log(`   ✓ ${medicalIds.length} medical companies created`);

    // ── 3. Medical staff ──────────────────────────────────────────────────────
    console.log('👨‍⚕️  Creating medical staff...');
    const roles = ['admin', 'doctor', 'nurse', 'secretary'] as const;
    const staffRows: typeof medicalStaffTable.$inferInsert[] = medicalUserIds.map(
        (userId, i) => ({
            userId,
            medicalCompanyId: medicalIds[i % medicalIds.length],
            role: i === 0 ? 'admin' : pick(roles), // ensure at least one admin
            createdAt: randDate(365),
            updatedAt: randDate(60),
        }),
    );

    await db.insert(medicalStaffTable).values(staffRows);
    console.log(`   ✓ ${staffRows.length} staff members created`);

    // ── 4. Client companies ───────────────────────────────────────────────────
    console.log('🏢 Creating client companies...');
    const onboardingStatuses = [
        'company_details', 'search_medical', 'pending_request', 'completed',
    ] as const;
    const clientCompanyRows: typeof clientCompaniesTable.$inferInsert[] =
        CLIENT_COMPANY_NAMES.map((name, i) => {
            const city = pick(CITIES);
            const isCompleted = i < 10; // first 10 are fully onboarded
            return {
                name,
                siret: Array.from({ length: 14 }, () => randInt(0, 9)).join(''),
                address: `${randInt(1, 300)} avenue des Entreprises`,
                postalCode: POSTAL_CODES[city],
                city,
                sector: pick(SECTORS),
                employeeCount: randInt(5, 500),
                medicalCompanyId: isCompleted ? medicalIds[i % medicalIds.length] : null,
                onboardingStatus: isCompleted ? 'completed' : pick(onboardingStatuses),
                createdAt: randDate(365),
                updatedAt: randDate(60),
            };
        });

    const insertedClients = await db
        .insert(clientCompaniesTable)
        .values(clientCompanyRows)
        .returning({ id: clientCompaniesTable.id });
    const clientIds = insertedClients.map(r => r.id);
    console.log(`   ✓ ${clientIds.length} client companies created`);

    // ── 5. Employees ──────────────────────────────────────────────────────────
    console.log('👷 Creating employees...');
    const empRoles = ['company_admin', 'employee'] as const;
    const employeeRows: typeof employeesTable.$inferInsert[] = employeeUserIds.map(
        (userId, i) => ({
            userId,
            clientCompanyId: clientIds[i % clientIds.length],
            role: i % clientIds.length === 0 ? 'company_admin' : pick(empRoles),
            position: pick(POSITIONS),
            createdAt: randDate(365),
            updatedAt: randDate(30),
        }),
    );

    const insertedEmployees = await db
        .insert(employeesTable)
        .values(employeeRows)
        .returning({ id: employeesTable.id });
    const employeeIds = insertedEmployees.map(r => r.id);
    console.log(`   ✓ ${employeeIds.length} employees created`);

    // ── 6. Membership requests ────────────────────────────────────────────────
    console.log('📋 Creating membership requests...');
    const requestStatuses = ['pending', 'accepted', 'rejected', 'dismissed'] as const;
    const requestRows: typeof membershipRequestsTable.$inferInsert[] = clientIds.map(
        (clientCompanyId, i) => ({
            clientCompanyId,
            medicalCompanyId: medicalIds[i % medicalIds.length],
            status: i < 10 ? 'accepted' : pick(requestStatuses),
            message: Math.random() > 0.5
                ? `Bonjour, nous souhaitons rejoindre votre réseau de santé au travail.`
                : null,
            createdAt: randDate(300),
            updatedAt: randDate(60),
        }),
    );

    await db.insert(membershipRequestsTable).values(requestRows);
    console.log(`   ✓ ${requestRows.length} membership requests created`);

    // ── 7. Bookings ───────────────────────────────────────────────────────────
    console.log('📅 Creating bookings...');
    const bookingStatuses = ['scheduled', 'completed', 'cancelled'] as const;
    const bookingRows: typeof bookingsTable.$inferInsert[] = [];

    // ~3 bookings per employee on average
    for (let i = 0; i < employeeIds.length * 3; i++) {
        const status = pick(bookingStatuses);
        const isPast = status === 'completed' || status === 'cancelled';
        bookingRows.push({
            employeeId: pick(employeeIds),
            medicalCompanyId: pick(medicalIds),
            scheduledAt: isPast ? randDate(180) : futureDate(60),
            status,
            notes: Math.random() > 0.6 ? 'Visite de routine annuelle.' : null,
            createdAt: randDate(200),
            updatedAt: randDate(30),
        });
    }

    await db.insert(bookingsTable).values(bookingRows);
    console.log(`   ✓ ${bookingRows.length} bookings created`);

    // ── 8. Documents ──────────────────────────────────────────────────────────
    console.log('📄 Creating documents...');
    const docRows: typeof documentsTable.$inferInsert[] = [];

    // ~2 documents per employee
    for (let i = 0; i < employeeIds.length * 2; i++) {
        const type = pick(DOC_TYPES);
        const empId = pick(employeeIds);
        docRows.push({
            employeeId: empId,
            name: `${type} - ${new Date().getFullYear()}`,
            type,
            url: `https://storage.example.com/documents/${uid()}.pdf`,
            createdAt: randDate(365),
        });
    }

    await db.insert(documentsTable).values(docRows);
    console.log(`   ✓ ${docRows.length} documents created`);

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n✅ Seed complete!');
    console.log('─'.repeat(40));
    console.log(`   Users              : ${allUserRows.length}`);
    console.log(`   Medical companies  : ${medicalIds.length}`);
    console.log(`   Medical staff      : ${staffRows.length}`);
    console.log(`   Client companies   : ${clientIds.length}`);
    console.log(`   Employees          : ${employeeIds.length}`);
    console.log(`   Membership requests: ${requestRows.length}`);
    console.log(`   Bookings           : ${bookingRows.length}`);
    console.log(`   Documents          : ${docRows.length}`);
    console.log('─'.repeat(40));
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});