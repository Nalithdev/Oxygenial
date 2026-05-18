import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const deleteEmployee = companyAdminProcedure
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
    });

    if (!employee) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Employee not found',
      });
    }

    if (employee.userId === context.employee.userId) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You cannot delete yourself',
      });
    }

    await database
      .delete(employeesTable)
      .where(eq(employeesTable.id, input.id));

    return { success: true };
  });
