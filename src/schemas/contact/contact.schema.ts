import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const Contact = pgTable("Contact", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  details: varchar().notNull(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
