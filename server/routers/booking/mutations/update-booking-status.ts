import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { bookingsTable } from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const updateBookingStatus = medicalStaffProcedure
  .input(
    z.object({
      id: z.number(),
      status: z.enum(['scheduled', 'completed', 'cancelled']),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const booking = await database.query.bookingsTable.findFirst({
      where: and(
        eq(bookingsTable.id, input.id),
        eq(bookingsTable.medicalCompanyId, context.medicalCompany.id),
      ),
    });

    if (!booking) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Booking not found',
      });
    }

    const [updatedBooking] = await database
      .update(bookingsTable)
      .set({
        status: input.status,
        notes: input.notes ?? booking.notes,
        updatedAt: new Date(),
      })
      .where(eq(bookingsTable.id, input.id))
      .returning();

    return updatedBooking;
  });
