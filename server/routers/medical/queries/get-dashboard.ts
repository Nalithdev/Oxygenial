import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import {
  clientCompaniesTable,
  membershipRequestsTable,
  bookingsTable,
} from '@/db/schema/global';
import { eq, and, gte, desc } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMedicalDashboard = medicalStaffProcedure.handler(
  async ({ context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const pendingRequests =
      await database.query.membershipRequestsTable.findMany({
        where: and(
          eq(
            membershipRequestsTable.medicalCompanyId,
            context.medicalCompany.id,
          ),
          eq(membershipRequestsTable.status, 'pending'),
        ),
        with: {
          clientCompany: true,
        },
        orderBy: [desc(membershipRequestsTable.createdAt)],
        limit: 5,
      });

    const clientCompanies = await database.query.clientCompaniesTable.findMany({
      where: eq(
        clientCompaniesTable.medicalCompanyId,
        context.medicalCompany.id,
      ),
      with: {
        employees: true,
      },
    });

    const upcomingBookings = await database.query.bookingsTable.findMany({
      where: and(
        eq(bookingsTable.medicalCompanyId, context.medicalCompany.id),
        eq(bookingsTable.status, 'scheduled'),
        gte(bookingsTable.scheduledAt, new Date()),
      ),
      with: {
        employee: {
          with: {
            user: true,
            clientCompany: true,
          },
        },
      },
      orderBy: [desc(bookingsTable.scheduledAt)],
      limit: 10,
    });

    return {
      medicalCompany: context.medicalCompany,
      pendingRequests,
      clientCompanies,
      upcomingBookings,
      stats: {
        totalClients: clientCompanies.length,
        totalEmployees: clientCompanies.reduce(
          (sum, c) => sum + c.employees.length,
          0,
        ),
        pendingRequestsCount: pendingRequests.length,
        upcomingBookingsCount: upcomingBookings.length,
      },
    };
  },
);
