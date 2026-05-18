import { z } from 'zod';
import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { clientCompaniesTable, employeesTable } from '@/db/schema/global';
import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';

export const createCompany = authenticatedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255),
      siret: z.string().length(14).optional(),
      address: z.string().max(500).optional(),
      postalCode: z.string().max(10).optional(),
      city: z.string().max(255).optional(),
      sector: z.string().max(255).optional(),
      employeeCount: z.number().min(1).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const existingEmployee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
    });

    if (existingEmployee) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You are already associated with a company',
      });
    }

    const [company] = await database
      .insert(clientCompaniesTable)
      .values({
        name: input.name,
        siret: input.siret,
        address: input.address,
        postalCode: input.postalCode,
        city: input.city,
        sector: input.sector,
        employeeCount: input.employeeCount,
        onboardingStatus: 'search_medical',
      })
      .returning();

    await database.insert(employeesTable).values({
      userId: context.user.id,
      clientCompanyId: company.id,
      role: 'company_admin',
      position: 'Administrateur',
    });

    return company;
  });
