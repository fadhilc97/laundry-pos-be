import { Request, Response } from "express";
import { db } from "@/services";
import { Transaction, TransactionItem } from "@/schemas";
import { eq, sql } from "drizzle-orm";

export async function getDetailTransactionController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const transaction = await db.query.Transaction.findFirst({
    extras: {
      totalTransactionAmount: sql<number>`(
        SELECT COALESCE(SUM("qty" * "price"), 0)::INT
        FROM "TransactionItem"
        WHERE "transactionId" = ${+id}
      )`.as("totalTransactionAmount"),
      totalPaidAmount: sql<number>`(
        SELECT COALESCE(SUM("amount"), 0)::INT
        FROM "TransactionPayment"
        WHERE "transactionId" = ${+id} AND "status" = 'DONE'
      )`.as("totalPaidAmount"),
    },
    where: eq(Transaction.id, +id),
    with: {
      currency: true,
      items: {
        with: { quantityUnit: true },
        extras: {
          subTotal: sql`${TransactionItem.qty} * ${TransactionItem.price}`.as(
            "subTotal"
          ),
        },
      },
      customer: {
        with: {
          customerContacts: {
            with: {
              contact: true,
            },
          },
        },
      },
      location: {
        columns: { name: true },
      },
    },
  });

  res.status(200).json({
    message: "Success get detail transaction",
    data: {
      ...transaction,
      pendingPaid:
        (transaction?.totalTransactionAmount || 0) -
        (transaction?.totalPaidAmount || 0),
    },
  });
}
