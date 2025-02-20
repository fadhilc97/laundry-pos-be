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

const serviceTypes = ["REGULAR", "EXPRESS", "FLASH"] as const;

export type ServiceType = (typeof serviceTypes)[number];

export const ServiceTypesEnum = pgEnum("ServiceType", serviceTypes);

export const Product = pgTable("Product", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  price: decimal().notNull().default("0.00"),
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
