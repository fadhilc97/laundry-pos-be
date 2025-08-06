import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const QuantityUnit = pgTable("QuantityUnit", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  shortName: varchar().notNull(),
  decimalPlaces: integer().default(0),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
