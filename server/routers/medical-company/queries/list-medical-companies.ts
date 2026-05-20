import { z } from 'zod';
import { publicProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { medicalCompaniesTable } from '@/db/schema/global';
import { inArray, like, or, sql } from 'drizzle-orm';
import { getPostalCodesNearby } from '@/lib/geo';

export const listMedicalCompanies = publicProcedure
  .input(
    z.object({
      search: z.string().optional(),
      postalCode: z.string().optional(),
      radiusKm: z.number().min(1).max(100).default(30),
      sector: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input }) => {
    const conditions = [];

    if (input.search) {
      const searchTerm = `%${input.search}%`;
      conditions.push(
        or(
          like(medicalCompaniesTable.name, searchTerm),
          like(medicalCompaniesTable.city, searchTerm),
          like(medicalCompaniesTable.description, searchTerm),
        ),
      );
    }

    if (input.postalCode) {
      // Pour un code postal complet (5 chiffres), on utilise la géolocalisation.
      // Pour une saisie partielle, on garde le matching par préfixe.
      if (input.postalCode.length === 5) {
        const nearbyPostalCodes = (await getPostalCodesNearby(
          input.postalCode,
          input.radiusKm * 1000,
        )).slice(0, 200);
        conditions.push(
          or(
            inArray(medicalCompaniesTable.postalCode, nearbyPostalCodes),
            like(
              medicalCompaniesTable.coveragePostalCodes,
              `%${input.postalCode}%`,
            ),
          ),
        );
      } else {
        conditions.push(
          or(
            like(medicalCompaniesTable.postalCode, `${input.postalCode}%`),
            like(
              medicalCompaniesTable.coveragePostalCodes,
              `%${input.postalCode}%`,
            ),
          ),
        );
      }
    }

    if (input.sector) {
      conditions.push(like(medicalCompaniesTable.sectors, `%${input.sector}%`));
    }

    const whereClause =
      conditions.length > 0
        ? sql`${conditions.reduce((acc, cond) => sql`${acc} AND ${cond}`)}`
        : undefined;

    const companies = await database
      .select()
      .from(medicalCompaniesTable)
      .where(whereClause)
      .limit(input.limit)
      .offset(input.offset);

    return companies;
  });
