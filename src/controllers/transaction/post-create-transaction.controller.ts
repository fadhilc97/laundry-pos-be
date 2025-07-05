import { Response } from "express";
import { db } from "@/services";
import { Transaction, TransactionItem } from "@/schemas";
import { IAuthRequest, IPostCreateTransactionDto } from "@/utils";
import {
  getCurrentSequence,
  updateNextSequence,
  getCurrentLaundryCurrency,
} from "@/helpers";
import { generateReceiptTransaction } from "./post-generate-receipt-transaction.controller";
import { eq } from "drizzle-orm";

export async function postCreateTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId as number;
  const { customerId, serviceType, items }: IPostCreateTransactionDto =
    req.body;

  const sequence = await getCurrentSequence({
    configKey: "transaction_sequence_id",
    userId,
    res,
  });

  const currencyConfig = await getCurrentLaundryCurrency({
    res,
    userId,
    configKey: "currency_id",
  });

  let createdTransactionId: number | undefined;
  await db.transaction(async (tx) => {
    const [createdTransaction] = await tx
      .insert(Transaction)
      .values({
        currencyId: currencyConfig?.id as number,
        customerId,
        serviceType,
        userId,
        transactionNo: sequence?.sequenceNo as string,
      })
      .returning({ id: Transaction.id });
    createdTransactionId = createdTransaction.id;

    await tx.insert(TransactionItem).values(
      items.map((item) => ({
        ...item,
        description: item.description,
        transactionId: createdTransaction.id,
        qty: item.qty.toString(),
        price: item.price.toString(),
      }))
    );

    await updateNextSequence({
      tx,
      sequenceId: sequence?.sequenceId,
      nextSequence: sequence?.nextSequence,
    });
  });

  if (createdTransactionId) {
    generateReceiptTransaction(createdTransactionId, userId);
  }

  res.status(201).json({
    data: { transactionId: createdTransactionId },
    message: "Success create transaction",
  });
}
