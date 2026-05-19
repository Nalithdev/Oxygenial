import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { medicalStaffTable, medicalCompaniesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const getMyMedicalCompany = authenticatedProcedure
  .handler(async ({ context }) => {
    const staff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
      with: {
        medicalCompany: true,
      },
    });

    if (!staff) {
      throw new ORPCError('NOT_FOUND', {
        message: 'You are not associated with a medical company',
      });
    }

    return {
      company: staff.medicalCompany,
      role: staff.role,
    };
  });
