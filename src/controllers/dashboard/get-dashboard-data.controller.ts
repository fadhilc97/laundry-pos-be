import { Transaction, TransactionItem, TransactionPayment } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, Role } from "@/utils";
import { eq, SQL, sql } from "drizzle-orm";
import { Response } from "express";

export async function getDashboardDataController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId;
  const roles = req.userRoles;

  const transactionCount = await getTransactionCount(userId, roles);
  const paymentAggregate = await getPaymentAggregate(userId, roles);

  res.status(200).json({
    message: "Success get dashboard data",
    data: {
      transactionCount,
      paymentAggregate,
    },
  });
}

async function getTransactionCount(userId?: number, roles?: Role[]) {
  let whereParams: SQL | undefined = undefined;
  if (roles?.includes(Role.STAFF)) {
    whereParams = eq(Transaction.userId, userId as number);
  }

  return await db
    .select({
      status: Transaction.status,
      count: sql<number>`CAST(COUNT(*) AS INT)`,
    })
    .from(Transaction)
    .groupBy(Transaction.status)
    .where(whereParams);
}

async function getPaymentAggregate(userId?: number, roles?: Role[]) {
  let whereParams: SQL | undefined = undefined;
  if (roles?.includes(Role.STAFF)) {
    whereParams = eq(Transaction.userId, userId as number);
  }

  const [{ sumAmount }] = await db
    .select({
      sumAmount: sql<number>`CAST(COALESCE(SUM(${TransactionItem.qty} * ${TransactionItem.price}),0) AS INT)`,
    })
    .from(TransactionItem)
    .where(whereParams);

  const [{ sumPaidAmount }] = await db
    .select({
      sumPaidAmount: sql<number>`CAST(COALESCE(SUM(${TransactionPayment.amount}), 0) AS INT)`,
    })
    .from(TransactionPayment)
    .where(whereParams);

  return {
    sumAmount,
    sumPaidAmount,
    sumUnpaidAmount: sumAmount - sumPaidAmount,
  };
}
