import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "@/services";
import {
  Transaction,
  TransactionPayment,
  TransactionPaymentStatus,
} from "@/schemas";
import { IPostCreateTransactionPaymentDto } from "@/utils";
import { getCurrentSequence, updateNextSequence } from "@/helpers";
import { generateReceiptTransaction } from ".";

export async function postCreateTransactionPaymentController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { paymentMethod, amount }: IPostCreateTransactionPaymentDto = req.body;

  const transaction = await db.query.Transaction.findFirst({
    where: eq(Transaction.id, +id),
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
    with: {
      items: {
        columns: { qty: true, price: true },
      },
      payments: {
        columns: { amount: true, status: true },
        where: eq(TransactionPayment.status, "DONE"),
      },
    },
  });

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  if (transaction?.items.length <= 0) {
    res.status(404).json({ message: "No transaction items recorded" });
    return;
  }

  const dueAmount =
    transaction.totalTransactionAmount - transaction.totalPaidAmount;

  if (dueAmount <= 0) {
    res.status(422).json({ message: "Transaction is fully paid" });
    updateTransactionPaymentStatus(+id, "PAID");
    return;
  }

  const sequence = await getCurrentSequence({
    configKey: "payment_sequence_id",
    userId: transaction.userId,
    res,
  });

  const change = amount - dueAmount;

  let paymentAmount: number = amount;
  let paymentStatus: TransactionPaymentStatus = "UNPAID";
  if (change >= 0) {
    paymentAmount = dueAmount;
    paymentStatus = "PAID";
  }

  await db.transaction(async (tx) => {
    await tx.insert(TransactionPayment).values({
      transactionId: +id,
      amount: paymentAmount.toString(),
      paymentMethod,
      reference: sequence?.sequenceNo,
      status: "DONE",
    });

    await tx
      .update(Transaction)
      .set({ paymentStatus })
      .where(eq(Transaction.id, +id));

    await updateNextSequence({
      tx,
      nextSequence: sequence?.nextSequence as number,
      sequenceId: sequence?.sequenceId as number,
    });
  });

  generateReceiptTransaction(transaction.id, transaction.userId);

  res.status(201).json({
    message: "Success create payment to this transaction",
    data: { change },
  });
}

async function updateTransactionPaymentStatus(
  id: number,
  paymentStatus: TransactionPaymentStatus
) {
  await db
    .update(Transaction)
    .set({ paymentStatus })
    .where(eq(Transaction.id, +id));
}
