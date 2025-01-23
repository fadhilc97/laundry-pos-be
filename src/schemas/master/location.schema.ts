import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";

export const Location = pgTable("Location", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
