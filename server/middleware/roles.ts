import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { authenticatedProcedure } from './auth';
import { database } from '@/db';
import { employeesTable, medicalStaffTable } from '@/db/schema/global';

export const medicalStaffProcedure = authenticatedProcedure.use(
  async ({ context, next }) => {
    const medicalStaff = await database.query.medicalStaffTable.findFirst({
      where: eq(medicalStaffTable.userId, context.user.id),
      with: {
        medicalCompany: true,
      },
    });

    if (!medicalStaff) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You are not associated with any medical organization',
      });
    }

    return next({
      context: {
        medicalStaff,
        medicalCompany: medicalStaff.medicalCompany,
      },
    });
  },
);

export const medicalAdminProcedure = medicalStaffProcedure.use(
  async ({ context, next }) => {
    if (context.medicalStaff.role !== 'admin') {
      throw new ORPCError('FORBIDDEN', {
        message: 'You must be a medical admin to access this resource',
      });
    }

    return next({
      context: {},
    });
  },
);

export const companyAdminProcedure = authenticatedProcedure.use(
  async ({ context, next }) => {
    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
      with: {
        clientCompany: true,
      },
    });

    if (!employee) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You are not associated with any company',
      });
    }

    if (employee.role !== 'company_admin') {
      throw new ORPCError('FORBIDDEN', {
        message: 'You must be a company admin to access this resource',
      });
    }

    return next({
      context: {
        employee,
        clientCompany: employee.clientCompany,
      },
    });
  },
);

export const employeeProcedure = authenticatedProcedure.use(
  async ({ context, next }) => {
    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
      with: {
        clientCompany: true,
      },
    });

    if (!employee) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You are not registered as an employee',
      });
    }

    return next({
      context: {
        employee,
        clientCompany: employee.clientCompany,
      },
    });
  },
);
