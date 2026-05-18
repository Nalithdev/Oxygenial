import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { membershipRequestsTable } from '@/db/schema/global';
import { eq, desc, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listMembershipRequests = medicalStaffProcedure
  .input(
    z.object({
      status: z
        .enum(['pending', 'accepted', 'rejected', 'dismissed'])
        .optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const baseCondition = eq(
      membershipRequestsTable.medicalCompanyId,
      context.medicalCompany.id,
    );
    const whereCondition = input.status
      ? and(baseCondition, eq(membershipRequestsTable.status, input.status))
      : baseCondition;

    const requests = await database.query.membershipRequestsTable.findMany({
      where: whereCondition,
      with: {
        clientCompany: true,
      },
      orderBy: [desc(membershipRequestsTable.createdAt)],
      limit: input.limit,
      offset: input.offset,
    });

    return requests;
  });
