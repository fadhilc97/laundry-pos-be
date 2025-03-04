import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";
import { Contact } from "../contact";
import { relations } from "drizzle-orm";
import { Sequence } from "../sequence";

export const Laundry = pgTable("Laundry", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  address: text().notNull(),
  imageUrl: varchar(),
});

export const LaundryConfig = pgTable("LaundryConfig", {
  id: serial().primaryKey(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
  transactionSequenceId: integer().references(() => Sequence.id),
  paymentSequenceId: integer().references(() => Sequence.id),
});

export const LaundryContact = pgTable("LaundryContact", {
  id: serial().primaryKey(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
  contactId: integer()
    .notNull()
    .references(() => Contact.id),
});

export const laundryRelations = relations(Laundry, ({ one }) => ({
  sequence: one(Sequence),
  laundryConfig: one(LaundryConfig),
}));

export const laundryConfigRelations = relations(LaundryConfig, ({ one }) => ({
  transactionSequence: one(Sequence, {
    fields: [LaundryConfig.transactionSequenceId],
    references: [Sequence.id],
  }),
  paymentSequence: one(Sequence, {
    fields: [LaundryConfig.paymentSequenceId],
    references: [Sequence.id],
  }),
}));
