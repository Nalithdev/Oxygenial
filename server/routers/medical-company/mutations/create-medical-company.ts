import { z } from 'zod';
import { authenticatedProcedure } from '@/server/middleware/auth';
import { database } from '@/db';
import {
  medicalCompaniesTable,
  medicalStaffTable,
  employeesTable,
} from '@/db/schema/global';
import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';

export const createMedicalCompany = authenticatedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      address: z.string().max(500).optional(),
      postalCode: z.string().max(10).optional(),
      city: z.string().max(255).optional(),
      phone: z.string().max(20).optional(),
      email: z.string().email().optional(),
      website: z.string().max(255).optional(),
      sectors: z.string().optional(),
      coveragePostalCodes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const existingMedicalStaff =
      await database.query.medicalStaffTable.findFirst({
        where: eq(medicalStaffTable.userId, context.user.id),
      });

    if (existingMedicalStaff) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You are already associated with a medical company',
      });
    }

    const existingEmployee = await database.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, context.user.id),
    });

    if (existingEmployee) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You are already associated with a client company',
      });
    }

    const [medicalCompany] = await database
      .insert(medicalCompaniesTable)
      .values({
        name: input.name,
        description: input.description,
        address: input.address,
        postalCode: input.postalCode,
        city: input.city,
        phone: input.phone,
        email: input.email,
        website: input.website,
        sectors: input.sectors,
        coveragePostalCodes: input.coveragePostalCodes,
      })
      .returning();

    await database.insert(medicalStaffTable).values({
      userId: context.user.id,
      medicalCompanyId: medicalCompany.id,
      role: 'admin',
    });

    return medicalCompany;
  });
