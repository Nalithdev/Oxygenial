import { z } from 'zod';
import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { medicalStaffTable, medicalCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const updateMedicalCompany = authenticatedProcedure
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
    const staff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
    });

    if (!staff) {
      throw new ORPCError('NOT_FOUND', {
        message: 'You are not associated with a medical company',
      });
    }

    if (staff.role !== 'admin') {
      throw new ORPCError('FORBIDDEN', {
        message: 'Only admins can update the company profile',
      });
    }

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
      .where(eq(medicalCompaniesTable.id, staff.medicalCompanyId))
      .returning();

    return updated;
  });
