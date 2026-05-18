import { z } from 'zod';
import { medicalStaffProcedure } from '@/server/middleware/roles';
import { database } from '@/db';
import { documentsTable, employeesTable } from '@/db/schema/global';
import { eq } from 'drizzle-orm';
import { ORPCError } from '@orpc/server';

export const createDocument = medicalStaffProcedure
  .input(
    z.object({
      employeeId: z.number(),
      name: z.string().min(1).max(255),
      type: z.string().max(100).optional(),
      url: z.string().url().max(500),
    }),
  )
  .handler(async ({ input, context }) => {
    if (!context.medicalCompany) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Medical company not found',
      });
    }

    const employee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.id, input.employeeId),
      with: {
        clientCompany: true,
      },
    });

    if (!employee) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Employee not found',
      });
    }

    if (
      employee.clientCompany?.medicalCompanyId !== context.medicalCompany.id
    ) {
      throw new ORPCError('FORBIDDEN', {
        message: 'This employee does not belong to your medical service',
      });
    }

    const [document] = await database
      .insert(documentsTable)
      .values({
        employeeId: input.employeeId,
        name: input.name,
        type: input.type,
        url: input.url,
      })
      .returning();

    return document;
  });
