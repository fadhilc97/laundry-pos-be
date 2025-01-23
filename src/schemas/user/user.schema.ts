import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";

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
