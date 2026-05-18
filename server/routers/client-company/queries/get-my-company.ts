import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { clientCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMyCompany = companyAdminProcedure.handler(
  async ({ context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const company = await database.query.clientCompaniesTable.findFirst({
      where: eq(clientCompaniesTable.id, context.clientCompany.id),
      with: {
        medicalCompany: true,
        employees: {
          with: {
            user: true,
          },
        },
        membershipRequests: {
          with: {
            medicalCompany: true,
          },
        },
      },
    });

    return company;
  },
);
