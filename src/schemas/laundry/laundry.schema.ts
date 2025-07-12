import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";
import { Contact } from "../contact";
import { relations } from "drizzle-orm";
import { Sequence } from "../sequence";
import { UserLaundry } from "../user";

export const Laundry = pgTable("Laundry", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  address: text().notNull(),
  imageUrl: varchar(),
});

export const LaundryConfig = pgTable("LaundryConfig", {
  id: serial().primaryKey(),
  key: varchar().notNull(),
  name: varchar().notNull(),
  value: varchar().notNull(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
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

export const laundryRelations = relations(Laundry, ({ one, many }) => ({
  sequence: one(Sequence),
  laundryConfig: many(LaundryConfig),
  laundryContacts: many(LaundryContact),
  laundryUsers: many(UserLaundry),
}));

export const laundryConfigRelations = relations(LaundryConfig, ({ one }) => ({
  transactionSequence: one(Laundry, {
    fields: [LaundryConfig.laundryId],
    references: [Laundry.id],
  }),
}));

export const laundryContactRelations = relations(LaundryContact, ({ one }) => ({
  contact: one(Contact, {
    fields: [LaundryContact.contactId],
    references: [Contact.id],
  }),
  laundry: one(Laundry, {
    fields: [LaundryContact.laundryId],
    references: [Laundry.id],
  }),
}));
