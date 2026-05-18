import { z } from 'zod';
import { publicProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { medicalCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMedicalCompany = publicProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    const company = await database.query.medicalCompaniesTable.findFirst({
      where: eq(medicalCompaniesTable.id, input.id),
    });

    if (!company) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    return company;
  });
