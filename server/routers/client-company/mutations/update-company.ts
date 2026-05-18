import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { clientCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const updateCompany = companyAdminProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255).optional(),
      siret: z.string().length(14).optional(),
      address: z.string().max(500).optional(),
      postalCode: z.string().max(10).optional(),
      city: z.string().max(255).optional(),
      sector: z.string().max(255).optional(),
      employeeCount: z.number().min(1).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const [company] = await database
      .update(clientCompaniesTable)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(clientCompaniesTable.id, context.clientCompany.id))
      .returning();

    return company;
  });
