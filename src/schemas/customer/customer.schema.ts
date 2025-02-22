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
