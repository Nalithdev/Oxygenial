import { z } from 'zod';
import { employeeProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { documentsTable } from '@/db/schema/global';
import { eq, desc } from 'drizzle-orm';

export const listMyDocuments = employeeProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    const documents = await database.query.documentsTable.findMany({
      where: eq(documentsTable.employeeId, context.employee.id),
      orderBy: [desc(documentsTable.createdAt)],
      limit: input.limit,
      offset: input.offset,
    });

    return documents;
  });
