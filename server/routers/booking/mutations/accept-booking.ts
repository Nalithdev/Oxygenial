import { z } from 'zod';
import { companyAdminProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { bookingsTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const acceptBooking = companyAdminProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    if (!context.clientCompany) {
      throw new ORPCError('NOT_FOUND', { message: 'Company not found' });
    }

    const booking = await database.query.bookingsTable.findFirst({
      where: eq(bookingsTable.id, input.id),
      with: { employee: true },
    });

    if (!booking) {
      throw new ORPCError('NOT_FOUND', { message: 'Booking not found' });
    }

    if (booking.employee.clientCompanyId !== context.clientCompany.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'This booking does not belong to your company',
      });
    }

    if (booking.status !== 'pending') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'This booking is not pending',
      });
    }

    const [updated] = await database
      .update(bookingsTable)
      .set({ status: 'scheduled', updatedAt: new Date() })
      .where(eq(bookingsTable.id, input.id))
      .returning();

    return updated;
  });
