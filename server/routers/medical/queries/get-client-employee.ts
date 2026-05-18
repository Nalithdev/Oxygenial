import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getClientEmployee = medicalStaffProcedure
  .input(z.object({ employeeId: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.id, input.employeeId),
      with: {
        user: true,
        clientCompany: true,
        bookings: {
          where: (bookings, { eq }) =>
            eq(bookings.medicalCompanyId, context.medicalCompany!.id),
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

    if (
      employee.clientCompany?.medicalCompanyId !== context.medicalCompany.id
    ) {
      throw new ORPCError('FORBIDDEN', {
        message: 'This employee does not belong to your medical service',
      });
    }

    return employee;
  });
