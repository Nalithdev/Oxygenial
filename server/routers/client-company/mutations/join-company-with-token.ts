import { z } from 'zod';
import { database } from '@/db';
import { invitationsTable, employeesTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';
import { authenticatedProcedure } from "@/server/middleware/auth";

export const joinCompanyWithToken = authenticatedProcedure
    .input(
        z.object({
            token: z.string().min(1, "Token d'invitation requis"),
        }),
    )
    .handler(async ({ input, context }) => {
        const { token } = input;
        const { user } = context;

        const invitation = await database.query.invitationsTable.findFirst({
            where: eq(invitationsTable.token, token),
        });

        if (!invitation) {
            throw new ORPCError('NOT_FOUND', { message: 'Token invalide ou expiré' });
        }

        const employeeExists = await database.query.employeesTable.findFirst({
            where: and(
                eq(employeesTable.clientCompanyId, invitation.clientCompanyId),
                eq(employeesTable.userId, user.id),
            ),
        });

        if (employeeExists) {
            throw new ORPCError('CONFLICT', { message: 'Déjà employé de cette entreprise' });
        }

        await database.insert(employeesTable).values({
            clientCompanyId: invitation.clientCompanyId,
            userId: user.id,
            role: 'company_admin',
            position : "Manager",
            createdAt: new Date(),
        });

        return { success: true };
    });
