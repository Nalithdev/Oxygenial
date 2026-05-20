import { z } from 'zod';
import { medicalAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { medicalCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';

export const updateMedicalCompany = medicalAdminProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      address: z.string().max(500).optional(),
      postalCode: z.string().max(10).optional(),
      city: z.string().max(255).optional(),
      phone: z.string().max(20).optional(),
      email: z.string().email().optional(),
      website: z.string().max(255).optional(),
      sectors: z.string().optional(),
      coveragePostalCodes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const [updated] = await database
      .update(medicalCompaniesTable)
      .set({
        name: input.name,
        description: input.description,
        address: input.address,
        postalCode: input.postalCode,
        city: input.city,
        phone: input.phone,
        email: input.email,
        website: input.website,
        sectors: input.sectors,
        coveragePostalCodes: input.coveragePostalCodes,
        updatedAt: new Date(),
      })
      .where(eq(medicalCompaniesTable.id, context.medicalCompany.id))
      .returning();

    return updated;
  });
