import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { bookingsTable, employeesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const createBooking = companyAdminProcedure
  .input(
    z.object({
      employeeId: z.number(),
      scheduledAt: z.string().datetime(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    if (!context.clientCompany.medicalCompanyId) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Your company is not linked to a medical service',
      });
    }

    const employee = await database.query.employeesTable.findFirst({
      where: and(
        eq(employeesTable.id, input.employeeId),
        eq(employeesTable.clientCompanyId, context.clientCompany.id),
      ),
    });

    if (!employee) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Employee not found',
      });
    }

    const [booking] = await database
      .insert(bookingsTable)
      .values({
        employeeId: input.employeeId,
        medicalCompanyId: context.clientCompany.medicalCompanyId,
        scheduledAt: new Date(input.scheduledAt),
        notes: input.notes,
      })
      .returning();

    return booking;
  });
