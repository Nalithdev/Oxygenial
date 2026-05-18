import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { clientCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listClientCompanies = medicalStaffProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const companies = await database.query.clientCompaniesTable.findMany({
      where: eq(
        clientCompaniesTable.medicalCompanyId,
        context.medicalCompany.id,
      ),
      with: {
        employees: {
          with: {
            user: true,
          },
        },
      },
      limit: input.limit,
      offset: input.offset,
    });

    return companies;
  });
