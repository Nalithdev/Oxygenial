import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const updateEmployee = companyAdminProcedure
  .input(
    z.object({
      id: z.number(),
      position: z.string().max(255).optional(),
      role: z.enum(['company_admin', 'employee']).optional(),
    }),
  )
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

    const [updatedEmployee] = await database
      .update(employeesTable)
      .set({
        position: input.position,
        role: input.role,
        updatedAt: new Date(),
      })
      .where(eq(employeesTable.id, input.id))
      .returning();

    return updatedEmployee;
  });
