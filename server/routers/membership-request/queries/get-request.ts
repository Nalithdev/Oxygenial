import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { membershipRequestsTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMembershipRequest = medicalStaffProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    console.log('[getMembershipRequest] Looking for request:', {
      requestId: input.id,
      medicalCompanyId: context.medicalCompany.id,
    });

    const request = await database.query.membershipRequestsTable.findFirst({
      where: and(
        eq(membershipRequestsTable.id, input.id),
        eq(membershipRequestsTable.medicalCompanyId, context.medicalCompany.id),
      ),
      with: {
        clientCompany: {
          with: {
            employees: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    console.log('[getMembershipRequest] Found:', request ? 'yes' : 'no');

    if (!request) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Request not found',
      });
    }

    return request;
  });
