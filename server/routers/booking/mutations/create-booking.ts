import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {
  bookingsTable,
  clientCompaniesTable,
  employeesTable,
} from '@/db/schema/global';
import { eq, and } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

// Nouveau flux : le rendez-vous est "proposé" (pending) par défaut, l'entreprise devra accepter/refuser
export const createBooking = medicalStaffProcedure
  .input(
    z.object({
      companyId: z.number(),
      employeeId: z.number(),
      scheduledAt: z.string().datetime(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    // Vérifie que l'entreprise est bien cliente du SPSTI du staff médical
    const clientCompany = await database.query.clientCompaniesTable.findFirst({
      where: and(
        eq(clientCompaniesTable.id, input.companyId),
        eq(clientCompaniesTable.medicalCompanyId, context.medicalCompany.id),
      ),
    });
    if (!clientCompany) {
      throw new ORPCError('FORBIDDEN', {
        message: 'This company is not a client of your medical organization',
      });
    }

    // Vérifie que l'employé appartient bien à cette entreprise
    const employee = await database.query.employeesTable.findFirst({
      where: and(
        eq(employeesTable.id, input.employeeId),
        eq(employeesTable.clientCompanyId, input.companyId),
      ),
    });
    if (!employee) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Employee not found in this company',
      });
    }

    // Par défaut, le rendez-vous est en attente d'acceptation (pending)
    const [booking] = await database
      .insert(bookingsTable)
      .values({
        employeeId: employee.id,
        medicalCompanyId: context.medicalCompany.id,
        scheduledAt: new Date(input.scheduledAt),
        notes: input.notes,
        status: 'pending',
      })
      .returning();

    return booking;
  });
