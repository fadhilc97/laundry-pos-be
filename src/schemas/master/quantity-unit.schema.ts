import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const QuantityUnit = pgTable("QuantityUnit", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  shortName: varchar().notNull(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
