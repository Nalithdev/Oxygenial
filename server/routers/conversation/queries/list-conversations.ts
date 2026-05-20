import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { medicalStaffTable, employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listConversations = authenticatedProcedure
  .handler(async ({ context }) => {
    const medicalStaff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
    });

    if (medicalStaff) {
      return database.query.conversationsTable.findMany({
        where: (c, { eq }) => eq(c.medicalCompanyId, medicalStaff.medicalCompanyId),
        with: {
          clientCompany: true,
          messages: {
            orderBy: (m, { desc }) => [desc(m.createdAt)],
            limit: 1,
          },
        },
        orderBy: (c, { desc }) => [desc(c.updatedAt)],
      });
    }

    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
      with: { clientCompany: true },
    });

    if (employee?.clientCompany) {
      return database.query.conversationsTable.findMany({
        where: (c, { eq }) => eq(c.clientCompanyId, employee.clientCompany.id),
        with: {
          medicalCompany: true,
          messages: {
            orderBy: (m, { desc }) => [desc(m.createdAt)],
            limit: 1,
          },
        },
        orderBy: (c, { desc }) => [desc(c.updatedAt)],
      });
    }

    throw new ORPCError('FORBIDDEN', { message: 'Not associated with any company' });
  });
