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
import { relations } from "drizzle-orm";

const transactionStatus = [
  "CHECK_IN",
  "IN_PROCESS",
  "FINISHED",
  "CHECK_OUT",
] as const;
const transactionPaymentStatus = ["UNPAID", "PAID"] as const;

export type TransactionStatus = (typeof transactionStatus)[number];
export type TransactionPaymentStatus =
  (typeof transactionPaymentStatus)[number];

export const TransactionStatusEnum = pgEnum(
  "TransactionStatus",
  transactionStatus
);
export const TransactionPaymentStatusEnum = pgEnum(
  "TransactionPaymentStatus",
  transactionPaymentStatus
);
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
  currencyId: integer()
    .notNull()
    .references(() => Currency.id),
  checkInDate: timestamp({ withTimezone: true }).notNull().defaultNow(),
  proceedDate: timestamp({ withTimezone: true }),
  finishedDate: timestamp({ withTimezone: true }),
  checkOutDate: timestamp({ withTimezone: true }),
  serviceType: ServiceTypesEnum().notNull().default("REGULAR"),
  status: TransactionStatusEnum().notNull().default("CHECK_IN"),
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
  description: varchar().notNull(),
  qty: decimal().notNull().default("1.00"),
  price: decimal().notNull().default("0.00"),
});

export const TransactionPayment = pgTable("TransactionPayment", {
  id: serial().primaryKey(),
  transactionId: integer()
    .notNull()
    .references(() => Transaction.id),
  date: timestamp().notNull().defaultNow(),
  reference: varchar(),
  paymentMethod: varchar().notNull().default("CASH"),
  amount: decimal().notNull().default("0.00"),
  status: PaymentStatusEnum().notNull().default("PENDING"),
});

export const transactionRelations = relations(Transaction, ({ many, one }) => ({
  items: many(TransactionItem),
  customer: one(Customer, {
    fields: [Transaction.customerId],
    references: [Customer.id],
  }),
  currency: one(Currency, {
    fields: [Transaction.currencyId],
    references: [Currency.id],
  }),
  location: one(Location, {
    fields: [Transaction.locationId],
    references: [Location.id],
  }),
  payments: many(TransactionPayment),
}));

export const transactionItemRelations = relations(
  TransactionItem,
  ({ one }) => ({
    transaction: one(Transaction, {
      fields: [TransactionItem.transactionId],
      references: [Transaction.id],
    }),
    quantityUnit: one(QuantityUnit, {
      fields: [TransactionItem.qtyUnitId],
      references: [QuantityUnit.id],
    }),
  })
);

export const transactionPaymentRelations = relations(
  TransactionPayment,
  ({ one }) => ({
    transaction: one(Transaction, {
      fields: [TransactionPayment.transactionId],
      references: [Transaction.id],
    }),
  })
);
