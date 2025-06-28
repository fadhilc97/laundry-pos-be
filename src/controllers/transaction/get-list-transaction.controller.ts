import {
  Currency,
  Customer,
  Transaction,
  TransactionItem,
  TransactionPayment,
} from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, Role } from "@/utils";
import { desc, eq, sql } from "drizzle-orm";
import { Response } from "express";

export async function getListTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const isStaff = req.userRoles?.includes(Role.STAFF);
  const paymentSql = sql<number>`(
    SELECT COALESCE(SUM(${TransactionItem.qty} * ${TransactionItem.price}) - SUM(${TransactionPayment.amount}), 0)
        FROM ${TransactionPayment}
        WHERE ${TransactionPayment.status} = 'DONE'
          AND ${TransactionPayment.transactionId} = ${Transaction.id}
  )`;
  const transactions = await db
    .select({
      id: Transaction.id,
      transactionNo: Transaction.transactionNo,
      checkInDate: Transaction.checkInDate,
      customerName: Customer.name,
      serviceType: Transaction.serviceType,
      status: Transaction.status,
      paymentStatus: Transaction.paymentStatus,
      totalAmount: sql<number>`COALESCE(SUM(${TransactionItem.qty} * ${TransactionItem.price}),0)`,
      currency: Currency.symbol,
      totalPendingPaidAmount: paymentSql,
    })
    .from(Transaction)
    .innerJoin(Customer, eq(Transaction.customerId, Customer.id))
    .innerJoin(Currency, eq(Transaction.currencyId, Currency.id))
    .leftJoin(
      TransactionItem,
      eq(Transaction.id, TransactionItem.transactionId)
    )
    .where(isStaff ? eq(Transaction.userId, req.userId as number) : undefined)
    .groupBy(
      Transaction.id,
      Transaction.transactionNo,
      Transaction.checkInDate,
      Customer.name,
      Transaction.serviceType,
      Transaction.status,
      Currency.symbol
    )
    .orderBy(desc(Transaction.checkInDate));

  res
    .status(200)
    .json({ message: "Success get transaction list", data: transactions });
}
