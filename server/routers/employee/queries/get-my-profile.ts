import { employeeProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMyProfile = employeeProcedure.handler(async ({ context }) => {
  const employee = await database.query.employeesTable.findFirst({
    where: eq(employeesTable.id, context.employee.id),
    with: {
      user: true,
      clientCompany: {
        with: {
          medicalCompany: true,
        },
      },
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
      message: 'Profile not found',
    });
  }

  return employee;
});
