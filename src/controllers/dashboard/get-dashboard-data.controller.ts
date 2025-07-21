import { Transaction, TransactionItem, TransactionPayment } from "@/schemas";
import { db } from "@/services";
import { getUserLaundryShared, IAuthRequest, Role } from "@/utils";
import { eq, inArray, SQL, sql } from "drizzle-orm";
import { Response } from "express";

export async function getDashboardDataController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId;
  const roles = req.userRoles;

  const userLaundry = await getUserLaundryShared(userId as number);
  const laundryUserIds =
    userLaundry?.laundry.laundryUsers.map(
      (laundryUser) => laundryUser.userId
    ) || [];

  const transactionCount = await getTransactionCount(laundryUserIds, roles);
  const paymentAggregate = await getPaymentAggregate(laundryUserIds, roles);

  res.status(200).json({
    message: "Success get dashboard data",
    data: {
      transactionCount,
      paymentAggregate,
    },
  });
}

async function getTransactionCount(laundryUserIds: number[], roles?: Role[]) {
  let whereParams: SQL | undefined = undefined;
  if (roles?.includes(Role.STAFF) || roles?.includes(Role.OWNER)) {
    whereParams = inArray(Transaction.userId, laundryUserIds);
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

async function getPaymentAggregate(laundryUserIds: number[], roles?: Role[]) {
  let whereParams: SQL | undefined = undefined;
  if (roles?.includes(Role.STAFF) || roles?.includes(Role.OWNER)) {
    whereParams = inArray(Transaction.userId, laundryUserIds);
  }

  const [{ sumAmount }] = await db
    .select({
      sumAmount: sql<number>`CAST(COALESCE(SUM(${TransactionItem.qty} * ${TransactionItem.price}),0) AS INT)`,
    })
    .from(TransactionItem)
    .innerJoin(Transaction, eq(Transaction.id, TransactionItem.transactionId))
    .where(whereParams);

  const [{ sumPaidAmount }] = await db
    .select({
      sumPaidAmount: sql<number>`CAST(COALESCE(SUM(${TransactionPayment.amount}), 0) AS INT)`,
    })
    .from(TransactionPayment)
    .innerJoin(
      Transaction,
      eq(Transaction.id, TransactionPayment.transactionId)
    )
    .where(whereParams);

  return {
    sumAmount,
    sumPaidAmount,
    sumUnpaidAmount: sumAmount - sumPaidAmount,
  };
}
