import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getEmployee = companyAdminProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const employee = await database.query.employeesTable.findFirst({
      where: and(
        eq(employeesTable.id, input.id),
        eq(employeesTable.clientCompanyId, context.clientCompany.id),
      ),
      with: {
        user: true,
        bookings: {
          with: {
            medicalCompany: true,
          },
          orderBy: (bookings, { desc }) => [desc(bookings.scheduledAt)],
        },
        documents: {
          orderBy: (documents, { desc }) => [desc(documents.createdAt)],
        },
      },
    });

    if (!employee) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Employee not found',
      });
    }

    return employee;
  });
