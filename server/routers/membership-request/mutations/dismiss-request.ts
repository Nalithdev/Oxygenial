import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {
  membershipRequestsTable,
  clientCompaniesTable,
} from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const dismissMembershipRequest = companyAdminProcedure
  .input(z.object({ requestId: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    const request = await database.query.membershipRequestsTable.findFirst({
      where: and(
        eq(membershipRequestsTable.id, input.requestId),
        eq(membershipRequestsTable.clientCompanyId, context.clientCompany.id),
      ),
    });

    if (!request) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'This request can no longer be dismissed',
      });
    }

    const [updatedRequest] = await database
      .update(membershipRequestsTable)
      .set({
        status: 'dismissed',
        updatedAt: new Date(),
      })
      .where(eq(membershipRequestsTable.id, input.requestId))
      .returning();

    await database
      .update(clientCompaniesTable)
      .set({
        onboardingStatus: 'search_medical',
        updatedAt: new Date(),
      })
      .where(eq(clientCompaniesTable.id, context.clientCompany.id));

    return updatedRequest;
  });
