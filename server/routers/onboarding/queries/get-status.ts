import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import { employeesTable, medicalStaffTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';

export const getOnboardingStatus = authenticatedProcedure.handler(
  async ({ context }) => {
    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
      with: {
        clientCompany: {
          with: {
            medicalCompany: true,
            membershipRequests: {
              orderBy: (requests, { desc }) => [desc(requests.createdAt)],
              limit: 1,
            },
          },
        },
      },
    });

    if (employee) {
      return {
        type: 'employee' as const,
        employee,
        clientCompany: employee.clientCompany,
        onboardingStatus:
          employee.clientCompany?.onboardingStatus ?? 'company_details',
      };
    }

    const medicalStaff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
      with: {
        medicalCompany: true,
      },
    });

    if (medicalStaff) {
      return {
        type: 'medical_staff' as const,
        medicalStaff,
        medicalCompany: medicalStaff.medicalCompany,
        onboardingStatus: 'completed' as const,
      };
    }

    return {
      type: 'none' as const,
      onboardingStatus: 'company_details' as const,
    };
  },
);
