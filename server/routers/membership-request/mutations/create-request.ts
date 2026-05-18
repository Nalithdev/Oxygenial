import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {
  membershipRequestsTable,
  clientCompaniesTable,
  medicalCompaniesTable,
} from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const createMembershipRequest = companyAdminProcedure
  .input(
    z.object({
      medicalCompanyId: z.number(),
      message: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Company not found',
      });
    }

    if (context.clientCompany.medicalCompanyId) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Your company is already a member of a medical service',
      });
    }

    const existingPendingRequest =
      await database.query.membershipRequestsTable.findFirst({
        where: and(
          eq(membershipRequestsTable.clientCompanyId, context.clientCompany.id),
          eq(membershipRequestsTable.status, 'pending'),
        ),
      });

    if (existingPendingRequest) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You already have a pending request',
      });
    }

    const medicalCompany = await database.query.medicalCompaniesTable.findFirst(
      {
        where: eq(medicalCompaniesTable.id, input.medicalCompanyId),
      },
    );

    if (!medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const [request] = await database
      .insert(membershipRequestsTable)
      .values({
        clientCompanyId: context.clientCompany.id,
        medicalCompanyId: input.medicalCompanyId,
        message: input.message,
      })
      .returning();

    await database
      .update(clientCompaniesTable)
      .set({
        onboardingStatus: 'pending_request',
        updatedAt: new Date(),
      })
      .where(eq(clientCompaniesTable.id, context.clientCompany.id));

    return request;
  });
