import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  serial,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const User = pgTable("User", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  imageUrl: varchar(),
});

export const Role = pgTable("Role", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  identifier: varchar().notNull().unique(),
});

export const UserRole = pgTable("UserRole", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => User.id),
  roleId: integer()
    .notNull()
    .references(() => Role.id),
});

export const UserLaundry = pgTable("UserLaundry", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => User.id),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
  joinedDate: timestamp().notNull().defaultNow(),
  isActive: boolean().notNull().default(true),
});

export const userRelations = relations(User, ({ many }) => ({
  userRoles: many(UserRole),
}));

export const userRoleRelations = relations(UserRole, ({ one }) => ({
  user: one(User, {
    fields: [UserRole.userId],
    references: [User.id],
  }),
  role: one(Role, {
    fields: [UserRole.roleId],
    references: [Role.id],
  }),
}));

export const userLaundryRelations = relations(UserLaundry, ({ one }) => ({
  laundry: one(Laundry, {
    fields: [UserLaundry.laundryId],
    references: [Laundry.id],
  }),
}));
