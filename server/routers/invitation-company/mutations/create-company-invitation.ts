import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { invitationsTable } from '@/db/schema/global';
import { randomUUID } from 'crypto';
import { ORPCError } from '@orpc/server';

export const createCompanyInvitation = companyAdminProcedure.handler(
    async ({ context }) => {
        if (!context.clientCompany) {
            throw new ORPCError('NOT_FOUND', {
                message: 'Company not found',
            });
        }

        const token = randomUUID();

        const [invitation] = await database
            .insert(invitationsTable)
            .values({
                clientCompanyId: context.clientCompany.id,
                token,
            })
            .returning();

        return invitation;
    }
);
