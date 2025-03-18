import { Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@/services";
import { Transaction, TransactionItem, Sequence } from "@/schemas";
import { IAuthRequest, IPostCreateTransactionDto } from "@/utils";
import { getCurrentSequence, updateNextSequence } from "@/helpers";

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

  await db.transaction(async (tx) => {
    const [createdTransaction] = await tx
      .insert(Transaction)
      .values({
        customerId,
        serviceType,
        userId,
        transactionNo: sequence?.sequenceNo as string,
      })
      .returning({ id: Transaction.id });

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

  res.status(201).json({ message: "Success create transaction" });
}
