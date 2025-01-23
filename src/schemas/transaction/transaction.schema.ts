import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  integer,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { Customer } from "../customer";
import {
  Currency,
  Location,
  Product,
  QuantityUnit,
  ServiceTypesEnum,
} from "../master";
import { User } from "../user";

export const TransactionStatusEnum = pgEnum("TransactionStatus", [
  "DRAFT",
  "IN_PROCESS",
  "FINISHED",
  "PICKED_UP",
]);
export const TransactionPaymentStatusEnum = pgEnum("TransactionPaymentStatus", [
  "UNPAID",
  "PAID",
]);
export const PaymentStatusEnum = pgEnum("PaymentStatus", ["PENDING", "DONE"]);

export const Transaction = pgTable("Transaction", {
  id: serial().primaryKey(),
  transactionNo: varchar().notNull(),
  customerId: integer()
    .notNull()
    .references(() => Customer.id),
  locationId: integer().references(() => Location.id),
  userId: integer()
    .notNull()
    .references(() => User.id),
  checkInDate: timestamp().notNull().defaultNow(),
  checkOutDate: timestamp(),
  finishedDate: timestamp(),
  serviceType: ServiceTypesEnum().notNull().default("REGULAR"),
  status: TransactionStatusEnum().notNull().default("DRAFT"),
  paymentStatus: TransactionPaymentStatusEnum().notNull().default("UNPAID"),
});

export const TransactionItem = pgTable("TransactionItem", {
  id: serial().primaryKey(),
  transactionId: integer()
    .notNull()
    .references(() => Transaction.id),
  productId: integer()
    .notNull()
    .references(() => Product.id),
  qtyUnitId: integer()
    .notNull()
    .references(() => QuantityUnit.id),
  currencyId: integer()
    .notNull()
    .references(() => Currency.id),
  description: varchar().notNull(),
  qty: decimal({ precision: 2 }).notNull().default("1.00"),
  price: decimal({ precision: 2 }).notNull().default("0.00"),
});

export const TransactionPayment = pgTable("TransactionPayment", {
  id: serial().primaryKey(),
  transactionId: integer()
    .notNull()
    .references(() => Transaction.id),
  date: timestamp().notNull().defaultNow(),
  reference: varchar(),
  paymentMethod: varchar().notNull(),
  amount: decimal({ precision: 2 }).notNull().default("0.00"),
  status: PaymentStatusEnum().notNull().default("PENDING"),
});
