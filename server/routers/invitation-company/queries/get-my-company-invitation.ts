import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {invitationsTable} from '@/db/schema/global';
import { ORPCError } from '@orpc/server';
import {eq} from "drizzle-orm";


export const getCompanyInvitation = companyAdminProcedure.handler(
    async ({ context }) => {
        if (!context.clientCompany) {
            throw new ORPCError('NOT_FOUND', {
                message: 'Company not found',
            });
        }

        const invitations = await database.query.invitationsTable.findMany({
            where: eq(invitationsTable.clientCompanyId, context.clientCompany.id)
        });

        return invitations;
    },
)
