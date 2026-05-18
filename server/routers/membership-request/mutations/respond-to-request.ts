import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {
  membershipRequestsTable,
  clientCompaniesTable,
} from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const respondToMembershipRequest = medicalStaffProcedure
  .input(
    z.object({
      requestId: z.number(),
      action: z.enum(['accept', 'reject']),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const request = await database.query.membershipRequestsTable.findFirst({
      where: and(
        eq(membershipRequestsTable.id, input.requestId),
        eq(membershipRequestsTable.medicalCompanyId, context.medicalCompany.id),
      ),
    });

    if (!request) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'This request has already been processed',
      });
    }

    const [updatedRequest] = await database
      .update(membershipRequestsTable)
      .set({
        status: input.action === 'accept' ? 'accepted' : 'rejected',
        updatedAt: new Date(),
      })
      .where(eq(membershipRequestsTable.id, input.requestId))
      .returning();

    if (input.action === 'accept') {
      await database
        .update(clientCompaniesTable)
        .set({
          medicalCompanyId: context.medicalCompany.id,
          onboardingStatus: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(clientCompaniesTable.id, request.clientCompanyId));
    } else {
      await database
        .update(clientCompaniesTable)
        .set({
          onboardingStatus: 'search_medical',
          updatedAt: new Date(),
        })
        .where(eq(clientCompaniesTable.id, request.clientCompanyId));
    }

    return updatedRequest;
  });
