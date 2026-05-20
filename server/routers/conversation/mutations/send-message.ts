import { z } from 'zod';
import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import {
  conversationsTable,
  messagesTable,
  medicalStaffTable,
  employeesTable,
} from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const sendMessage = authenticatedProcedure
  .input(
    z.object({
      conversationId: z.number().optional(),
      medicalCompanyId: z.number().optional(),
      content: z.string().trim().min(1).max(2000),
    }),
  )
  .handler(async ({ input, context }) => {
    let conversationId = input.conversationId;

    if (!conversationId) {
      if (!input.medicalCompanyId) {
        throw new ORPCError('BAD_REQUEST', { message: 'conversationId or medicalCompanyId required' });
      }

      const employee = await database.query.employeesTable.findFirst({
        where: eq(employeesTable.userId, context.user.id),
        with: { clientCompany: true },
      });

      if (!employee?.clientCompany) {
        throw new ORPCError('FORBIDDEN', { message: 'Not associated with a company' });
      }

      const existing = await database.query.conversationsTable.findFirst({
        where: and(
          eq(conversationsTable.clientCompanyId, employee.clientCompany.id),
          eq(conversationsTable.medicalCompanyId, input.medicalCompanyId),
        ),
      });

      if (existing) {
        conversationId = existing.id;
      } else {
        const [created] = await database
          .insert(conversationsTable)
          .values({
            clientCompanyId: employee.clientCompany.id,
            medicalCompanyId: input.medicalCompanyId,
          })
          .onConflictDoNothing()
          .returning();

        if (created) {
          conversationId = created.id;
        } else {
          const race = await database.query.conversationsTable.findFirst({
            where: and(
              eq(conversationsTable.clientCompanyId, employee.clientCompany.id),
              eq(conversationsTable.medicalCompanyId, input.medicalCompanyId!),
            ),
          });
          conversationId = race!.id;
        }
      }
    }

    const conversation = await database.query.conversationsTable.findFirst({
      where: eq(conversationsTable.id, conversationId),
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

    const [message] = await database
      .insert(messagesTable)
      .values({
        conversationId,
        senderUserId: context.user.id,
        content: input.content,
      })
      .returning();

    await database
      .update(conversationsTable)
      .set({ updatedAt: new Date() })
      .where(eq(conversationsTable.id, conversationId));

    return message;
  });
