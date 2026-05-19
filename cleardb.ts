import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import {
    documentsTable,
    bookingsTable,
    membershipRequestsTable,
    employeesTable,
    clientCompaniesTable,
    medicalStaffTable,
    medicalCompaniesTable,
} from './db/schema/global';
import { verification, account, session, user } from './db/schema/auth';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const DATABASE_URL =
    process.env.DATABASE_URL ?? '';

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

// ─── CLEAR ────────────────────────────────────────────────────────────────────
// L'ordre est important : supprimer d'abord les tables enfants (qui ont des FK)
// avant les tables parents pour éviter les erreurs de contrainte.
async function clear() {
    console.log('🗑️  Clearing database...\n');

    await db.delete(documentsTable);
    console.log('   ✓ documents');

    await db.delete(bookingsTable);
    console.log('   ✓ bookings');

    await db.delete(membershipRequestsTable);
    console.log('   ✓ membership_requests');

    await db.delete(employeesTable);
    console.log('   ✓ employees');

    await db.delete(medicalStaffTable);
    console.log('   ✓ medical_staff');

    await db.delete(clientCompaniesTable);
    console.log('   ✓ client_companies');

    await db.delete(medicalCompaniesTable);
    console.log('   ✓ medical_companies');

    // Tables d'auth (sessions, comptes, vérifications avant users)
    await db.delete(verification);
    console.log('   ✓ verification');

    await db.delete(account);
    console.log('   ✓ account');

    await db.delete(session);
    console.log('   ✓ session');

    await db.delete(user);
    console.log('   ✓ user');

    console.log('\n✅ Database cleared! Tables and schema are intact.');
}

clear().catch(err => {
    console.error('❌ Clear failed:', err);
    process.exit(1);
});
