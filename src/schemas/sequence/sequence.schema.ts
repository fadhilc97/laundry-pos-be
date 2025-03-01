import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const Sequence = pgTable("Sequence", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  minDigits: integer().notNull(),
  currentSequence: integer().notNull(),
});
