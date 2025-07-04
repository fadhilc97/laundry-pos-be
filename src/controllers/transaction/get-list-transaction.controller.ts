import {
  Currency,
  Customer,
  ServiceType,
  Transaction,
  TransactionItem,
  TransactionPayment,
  TransactionPaymentStatus,
  TransactionStatus,
} from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, PaginationQuery, Role } from "@/utils";
import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { Response } from "express";

type Query = {
  search?: string;
  startDate?: string;
  endDate?: string;
  serviceType?: ServiceType;
  transactionStatus?: TransactionStatus;
  paymentStatus?: TransactionPaymentStatus;
} & PaginationQuery;

export async function getListTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const query: Query = req.query;
  const limit = +(query.limit || "10");
  const page = +(query.page || "1");

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
    .where(
      and(
        isStaff ? eq(Transaction.userId, req.userId as number) : undefined,
        ...getSqlFilterParams(query)
      )
    )
    .groupBy(
      Transaction.id,
      Transaction.transactionNo,
      Transaction.checkInDate,
      Customer.name,
      Transaction.serviceType,
      Transaction.status,
      Currency.symbol
    )
    .orderBy(desc(Transaction.checkInDate))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${Transaction.id})` })
    .from(Transaction)
    .innerJoin(Customer, eq(Transaction.customerId, Customer.id))
    .where(
      and(
        isStaff ? eq(Transaction.userId, req.userId as number) : undefined,
        ...getSqlFilterParams(query)
      )
    );

  const lastPage = Math.max(1, Math.ceil(count / limit));

  res.status(200).json({
    message: "Success get transaction list",
    data: transactions,
    metadata: {
      pagination: {
        page,
        lastPage,
      },
    },
  });
}

function getSqlFilterParams(query: Query) {
  return [
    query.search
      ? or(
          ilike(Transaction.transactionNo, `%${query.search}%`),
          ilike(Customer.name, `%${query.search}%`)
        )
      : undefined,
    query.startDate
      ? gte(Transaction.checkInDate, new Date(`${query.startDate} 00:00:00`))
      : undefined,
    query.endDate
      ? lte(Transaction.checkInDate, new Date(`${query.endDate} 00:00:00`))
      : undefined,
    query.serviceType
      ? eq(Transaction.serviceType, query.serviceType)
      : undefined,
    query.transactionStatus
      ? eq(Transaction.status, query.transactionStatus)
      : undefined,
    query.paymentStatus
      ? eq(Transaction.paymentStatus, query.paymentStatus)
      : undefined,
  ];
}
