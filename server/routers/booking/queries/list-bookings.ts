import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { bookingsTable, employeesTable } from '@/db/schema/global';
import { eq, and, gte, desc } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listBookings = companyAdminProcedure
  .input(
    z.object({
      employeeId: z.number().optional(),
      upcoming: z.boolean().optional(),
      limit: z.number().min(1).max(1000).default(20),
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
    });

    const employeeIds = employees.map((e) => e.id);

    if (employeeIds.length === 0) {
      return [];
    }

    const conditions = [];

    if (input.employeeId) {
      if (!employeeIds.includes(input.employeeId)) {
        throw new ORPCError('FORBIDDEN', {
          message: 'Employee does not belong to your company',
        });
      }
      conditions.push(eq(bookingsTable.employeeId, input.employeeId));
    }

    if (input.upcoming) {
      conditions.push(gte(bookingsTable.scheduledAt, new Date()));
    }

    const bookings = await database.query.bookingsTable.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        employee: {
          with: {
            user: true,
            clientCompany: true,
          },
        },
        medicalCompany: true,
      },
      orderBy: [desc(bookingsTable.scheduledAt)],
      limit: input.limit,
      offset: input.offset,
    });

    return bookings.filter((b) => employeeIds.includes(b.employeeId));
  });
