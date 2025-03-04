import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry, LaundryConfig } from "../laundry";
import { relations } from "drizzle-orm";

export const Sequence = pgTable("Sequence", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  minDigits: integer(),
  currentSequence: integer().notNull().default(1),
  laundryId: integer().references(() => Laundry.id),
});

export const sequenceRelation = relations(Sequence, ({ one }) => ({
  user: one(Laundry, {
    fields: [Sequence.laundryId],
    references: [Laundry.id],
  }),
  laundryConfig: one(LaundryConfig),
}));
