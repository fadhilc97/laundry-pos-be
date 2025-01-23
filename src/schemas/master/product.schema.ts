import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { Laundry } from "../laundry";
import { QuantityUnit } from "./quantity-unit.schema";
import { Currency } from "./currency.schema";

export const ServiceTypesEnum = pgEnum("ServiceType", [
  "REGULAR",
  "EXPRESS",
  "FLASH",
]);

export const Product = pgTable("Product", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  price: decimal({ precision: 2 }).notNull().default("0.00"),
  qtyUnitId: integer()
    .notNull()
    .references(() => QuantityUnit.id),
  currencyId: integer()
    .notNull()
    .references(() => Currency.id),
  serviceType: ServiceTypesEnum().notNull().default("REGULAR"),
  laundryId: integer()
    .notNull()
    .references(() => Laundry.id),
});
