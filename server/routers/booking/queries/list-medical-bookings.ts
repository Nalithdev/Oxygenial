import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { bookingsTable } from '@/db/schema/global';
import { eq, and, gte, desc } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const listBookingsForMedical = medicalStaffProcedure
  .input(
    z.object({
      upcoming: z.boolean().optional(),
      limit: z.number().min(1).max(1000).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const conditions = [
      eq(bookingsTable.medicalCompanyId, context.medicalCompany.id),
    ];

    if (input.upcoming) {
      conditions.push(gte(bookingsTable.scheduledAt, new Date()));
    }

    return database.query.bookingsTable.findMany({
      where: and(...conditions),
      with: {
        employee: {
          with: {
            user: true,
            clientCompany: true,
          },
        },
        medicalCompany: true,
      },
      orderBy: [desc(bookingsTable.scheduledAt)],
      limit: input.limit,
      offset: input.offset,
    });
  });
