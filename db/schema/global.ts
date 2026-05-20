import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  real,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export * from './auth';
import { user } from './auth';

export const medicalStaffRoleEnum = pgEnum('medical_staff_role', [
  'admin',
  'doctor',
  'nurse',
  'secretary',
]);

export const clientCompanyRoleEnum = pgEnum('client_company_role', [
  'company_admin',
  'employee',
]);

export const requestStatusEnum = pgEnum('request_status', [
  'pending',
  'accepted',
  'rejected',
  'dismissed',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'scheduled',
  'completed',
  'cancelled',
]);

export const onboardingStatusEnum = pgEnum('onboarding_status', [
  'company_details',
  'search_medical',
  'pending_request',
  'completed',
]);

export const medicalCompaniesTable = pgTable('medical_companies', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  address: varchar({ length: 500 }),
  postalCode: varchar({ length: 10 }),
  city: varchar({ length: 255 }),
  phone: varchar({ length: 20 }),
  email: varchar({ length: 255 }),
  website: varchar({ length: 255 }),
  sectors: text(),
  coveragePostalCodes: text(),
  latitude: real(),
  longitude: real(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const medicalStaffTable = pgTable('medical_staff', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  medicalCompanyId: integer()
    .references(() => medicalCompaniesTable.id, { onDelete: 'cascade' })
    .notNull(),
  role: medicalStaffRoleEnum().notNull().default('secretary'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const clientCompaniesTable = pgTable('client_companies', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  siret: varchar({ length: 14 }),
  address: varchar({ length: 500 }),
  postalCode: varchar({ length: 10 }),
  city: varchar({ length: 255 }),
  sector: varchar({ length: 255 }),
  employeeCount: integer(),
  medicalCompanyId: integer().references(() => medicalCompaniesTable.id),
  onboardingStatus: onboardingStatusEnum().notNull().default('company_details'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const employeesTable = pgTable('employees', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  clientCompanyId: integer()
    .references(() => clientCompaniesTable.id, { onDelete: 'cascade' })
    .notNull(),
  role: clientCompanyRoleEnum().notNull().default('employee'),
  position: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const membershipRequestsTable = pgTable('membership_requests', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clientCompanyId: integer()
    .references(() => clientCompaniesTable.id, { onDelete: 'cascade' })
    .notNull(),
  medicalCompanyId: integer()
    .references(() => medicalCompaniesTable.id, { onDelete: 'cascade' })
    .notNull(),
  status: requestStatusEnum().notNull().default('pending'),
  message: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const bookingsTable = pgTable('bookings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  employeeId: integer()
    .references(() => employeesTable.id, { onDelete: 'cascade' })
    .notNull(),
  medicalCompanyId: integer()
    .references(() => medicalCompaniesTable.id, { onDelete: 'cascade' })
    .notNull(),
  scheduledAt: timestamp().notNull(),
  status: bookingStatusEnum().notNull().default('scheduled'),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const documentsTable = pgTable('documents', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  employeeId: integer()
    .references(() => employeesTable.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 100 }),
  url: varchar({ length: 500 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const medicalCompaniesRelations = relations(
  medicalCompaniesTable,
  ({ many }) => ({
    staff: many(medicalStaffTable),
    clientCompanies: many(clientCompaniesTable),
    membershipRequests: many(membershipRequestsTable),
    bookings: many(bookingsTable),
  }),
);

export const medicalStaffRelations = relations(
  medicalStaffTable,
  ({ one }) => ({
    user: one(user, {
      fields: [medicalStaffTable.userId],
      references: [user.id],
    }),
    medicalCompany: one(medicalCompaniesTable, {
      fields: [medicalStaffTable.medicalCompanyId],
      references: [medicalCompaniesTable.id],
    }),
  }),
);

export const clientCompaniesRelations = relations(
  clientCompaniesTable,
  ({ one, many }) => ({
    medicalCompany: one(medicalCompaniesTable, {
      fields: [clientCompaniesTable.medicalCompanyId],
      references: [medicalCompaniesTable.id],
    }),
    employees: many(employeesTable),
    membershipRequests: many(membershipRequestsTable),
  }),
);

export const employeesRelations = relations(
  employeesTable,
  ({ one, many }) => ({
    user: one(user, {
      fields: [employeesTable.userId],
      references: [user.id],
    }),
    clientCompany: one(clientCompaniesTable, {
      fields: [employeesTable.clientCompanyId],
      references: [clientCompaniesTable.id],
    }),
    bookings: many(bookingsTable),
    documents: many(documentsTable),
  }),
);

export const membershipRequestsRelations = relations(
  membershipRequestsTable,
  ({ one }) => ({
    clientCompany: one(clientCompaniesTable, {
      fields: [membershipRequestsTable.clientCompanyId],
      references: [clientCompaniesTable.id],
    }),
    medicalCompany: one(medicalCompaniesTable, {
      fields: [membershipRequestsTable.medicalCompanyId],
      references: [medicalCompaniesTable.id],
    }),
  }),
);

export const bookingsRelations = relations(bookingsTable, ({ one }) => ({
  employee: one(employeesTable, {
    fields: [bookingsTable.employeeId],
    references: [employeesTable.id],
  }),
  medicalCompany: one(medicalCompaniesTable, {
    fields: [bookingsTable.medicalCompanyId],
    references: [medicalCompaniesTable.id],
  }),
}));

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  employee: one(employeesTable, {
    fields: [documentsTable.employeeId],
    references: [employeesTable.id],
  }),
}));

export const conversationsTable = pgTable(
  'conversations',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clientCompanyId: integer()
      .references(() => clientCompaniesTable.id, { onDelete: 'cascade' })
      .notNull(),
    medicalCompanyId: integer()
      .references(() => medicalCompaniesTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [uniqueIndex('conversations_client_medical_idx').on(t.clientCompanyId, t.medicalCompanyId)],
);

export const messagesTable = pgTable('messages', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  conversationId: integer()
    .references(() => conversationsTable.id, { onDelete: 'cascade' })
    .notNull(),
  senderUserId: text('sender_user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  content: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const conversationsRelations = relations(conversationsTable, ({ one, many }) => ({
  clientCompany: one(clientCompaniesTable, {
    fields: [conversationsTable.clientCompanyId],
    references: [clientCompaniesTable.id],
  }),
  medicalCompany: one(medicalCompaniesTable, {
    fields: [conversationsTable.medicalCompanyId],
    references: [medicalCompaniesTable.id],
  }),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversationId],
    references: [conversationsTable.id],
  }),
  sender: one(user, {
    fields: [messagesTable.senderUserId],
    references: [user.id],
  }),
}));
