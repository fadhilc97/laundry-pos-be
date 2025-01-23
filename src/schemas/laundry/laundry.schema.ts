import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";
import { Contact } from "../contact";

export const Laundry = pgTable("Laundry", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  address: text().notNull(),
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
