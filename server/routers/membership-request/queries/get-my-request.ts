import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { membershipRequestsTable } from '@/db/schema/global';
import { eq, desc } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMyMembershipRequest = companyAdminProcedure.handler(
  async ({ context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const request = await database.query.membershipRequestsTable.findFirst({
      where: eq(
        membershipRequestsTable.clientCompanyId,
        context.clientCompany.id,
      ),
      with: {
        medicalCompany: true,
      },
      orderBy: [desc(membershipRequestsTable.createdAt)],
    });

    return request;
  },
);
