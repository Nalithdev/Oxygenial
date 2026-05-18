import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { clientCompaniesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getClientCompany = medicalStaffProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const company = await database.query.clientCompaniesTable.findFirst({
      where: and(
        eq(clientCompaniesTable.id, input.id),
        eq(clientCompaniesTable.medicalCompanyId, context.medicalCompany.id),
      ),
      with: {
        employees: {
          with: {
            user: true,
            bookings: {
              orderBy: (bookings, { desc }) => [desc(bookings.scheduledAt)],
              limit: 5,
            },
          },
        },
      },
    });

    if (!company) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Client company not found',
      });
    }

    return company;
  });
