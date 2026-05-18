import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listEmployees = companyAdminProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const employees = await database.query.employeesTable.findMany({
      where: eq(employeesTable.clientCompanyId, context.clientCompany.id),
      with: {
        user: true,
        bookings: {
          limit: 5,
          orderBy: (bookings, { desc }) => [desc(bookings.scheduledAt)],
        },
      },
      limit: input.limit,
      offset: input.offset,
    });

    return employees;
  });
