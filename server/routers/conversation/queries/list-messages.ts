import { z } from 'zod';
import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { conversationsTable, medicalStaffTable, employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listMessages = authenticatedProcedure
  .input(z.object({ conversationId: z.number() }))
  .handler(async ({ input, context }) => {
    const conversation = await database.query.conversationsTable.findFirst({
      where: eq(conversationsTable.id, input.conversationId),
    });

    if (!conversation) {
      throw new ORPCError('NOT_FOUND', { message: 'Conversation not found' });
    }

    const medicalStaff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
    });

    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
      with: { clientCompany: true },
    });

    const isMedical = medicalStaff?.medicalCompanyId === conversation.medicalCompanyId;
    const isCompany = employee?.clientCompany?.id === conversation.clientCompanyId;

    if (!isMedical && !isCompany) {
      throw new ORPCError('FORBIDDEN', { message: 'Access denied' });
    }

    return database.query.messagesTable.findMany({
      where: (m, { eq }) => eq(m.conversationId, input.conversationId),
      with: { sender: true },
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
  });
