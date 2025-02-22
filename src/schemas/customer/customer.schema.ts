import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  date,
} from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";
import { Contact } from "../contact";
import { relations } from "drizzle-orm";

export const Customer = pgTable("Customer", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  address: text(),
  createdAt: date().notNull().defaultNow(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});

export const CustomerContact = pgTable("CustomerContact", {
  id: serial().primaryKey(),
  customerId: integer()
    .notNull()
    .references(() => Customer.id, { onDelete: "cascade" }),
  contactId: integer()
    .notNull()
    .references(() => Contact.id),
});

export const customerRelations = relations(Customer, ({ many }) => ({
  customerContacts: many(CustomerContact),
}));

export const customerContactRelations = relations(
  CustomerContact,
  ({ one }) => ({
    customer: one(Customer, {
      fields: [CustomerContact.id],
      references: [Customer.id],
    }),
    contact: one(Contact, {
      fields: [CustomerContact.contactId],
      references: [Contact.id],
    }),
  })
);
