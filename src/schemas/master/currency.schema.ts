import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const Currency = pgTable("Currency", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  shortName: varchar().notNull(),
  countryName: varchar().notNull(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
