import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { isNull, or, eq } from 'drizzle-orm';
import * as schema from '../db/schema/global';

const database = drizzle(process.env.DATABASE_URL!, { schema });

async function geocodeAddress(
  address: string | null,
  postalCode: string | null,
  city: string | null,
): Promise<{ latitude: number; longitude: number } | null> {
  const parts = [address, postalCode, city].filter(Boolean);
  if (parts.length === 0) return null;

  const q = encodeURIComponent(parts.join(' '));
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${q}&limit=1`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: { geometry: { coordinates: [number, number] } }[];
    };
    const feature = data?.features?.[0];
    if (!feature) return null;
    const [longitude, latitude] = feature.geometry.coordinates;
    return { latitude, longitude };
  } catch {
    return null;
  }
}

async function run() {
  const companies = await database
    .select()
    .from(schema.medicalCompaniesTable)
    .where(
      or(
        isNull(schema.medicalCompaniesTable.latitude),
        isNull(schema.medicalCompaniesTable.longitude),
      ),
    );

  for (const company of companies) {
    const coords = await geocodeAddress(
      company.address,
      company.postalCode,
      company.city,
    );

    if (coords) {
      await database
        .update(schema.medicalCompaniesTable)
        .set({ latitude: coords.latitude, longitude: coords.longitude })
        .where(eq(schema.medicalCompaniesTable.id, company.id));
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  process.exit(0);
}

run().catch(() => process.exit(1));
