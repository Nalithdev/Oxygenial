import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { employeesTable, user } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const createEmployee = companyAdminProcedure
  .input(
    z.object({
      email: z.string().email(),
      position: z.string().max(255).optional(),
      role: z.enum(['company_admin', 'employee']).default('employee'),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, input.email),
    });

    if (!existingUser) {
      throw new ORPCError('NOT_FOUND', {
        message:
          'User not found. Please ask the employee to create an account first.',
      });
    }

    const existingEmployee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, existingUser.id),
    });

    if (existingEmployee) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'This user is already associated with a company',
      });
    }

    const [employee] = await database
      .insert(employeesTable)
      .values({
        userId: existingUser.id,
        clientCompanyId: context.clientCompany.id,
        role: input.role,
        position: input.position,
      })
      .returning();

    return employee;
  });
