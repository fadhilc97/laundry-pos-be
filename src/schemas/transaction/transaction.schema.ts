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
  checkInDate: timestamp({ withTimezone: true }).notNull().defaultNow(),
  checkOutDate: timestamp({ withTimezone: true }),
  finishedDate: timestamp({ withTimezone: true }),
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
  currencyId: integer()
    .notNull()
    .references(() => Currency.id),
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
  paymentMethod: varchar().notNull(),
  amount: decimal({ precision: 2 }).notNull().default("0.00"),
  status: PaymentStatusEnum().notNull().default("PENDING"),
});

export const transactionRelations = relations(Transaction, ({ many, one }) => ({
  items: many(TransactionItem),
  customer: one(Customer, {
    fields: [Transaction.customerId],
    references: [Customer.id],
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
