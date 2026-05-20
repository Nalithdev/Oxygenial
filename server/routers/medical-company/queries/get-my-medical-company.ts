import { medicalStaffProcedure } from '@/server/middleware/roles';

export const getMyMedicalCompany = medicalStaffProcedure
  .handler(async ({ context }) => {
    return {
      company: context.medicalCompany,
      role: context.medicalStaff.role,
    };
  });
