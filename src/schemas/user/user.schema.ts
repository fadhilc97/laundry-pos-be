import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";

export const UserSchema = pgTable("User", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  imageUrl: varchar(),
});

export const RoleSchema = pgTable("Role", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  identifier: varchar().notNull().unique(),
});

export const UserRoleSchema = pgTable("UserRole", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => UserSchema.id),
  roleId: integer()
    .notNull()
    .references(() => RoleSchema.id),
});
