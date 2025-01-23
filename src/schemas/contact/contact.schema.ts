import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Contact = pgTable("Contact", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  details: varchar().notNull(),
});
