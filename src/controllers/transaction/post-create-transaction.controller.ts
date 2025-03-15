import { Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@/services";
import { Transaction, TransactionItem, Sequence } from "@/schemas";
import { IAuthRequest, IPostCreateTransactionDto } from "@/utils";
import { getCurrentLaundrySequence } from "@/helpers";

export async function postCreateTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId as number;
  const { customerId, serviceType, items }: IPostCreateTransactionDto =
    req.body;

  // TODO: Refactor -> move the get current and next sequence to respective helper
  const sequence = await getCurrentLaundrySequence(res, userId);
  if (!sequence) {
    res.status(404).json({ message: "Sequence not found" });
    return;
  }

  const sequenceStringified = sequence?.currentSequence.toString();
  const nextSequence = sequence.currentSequence + 1;
  const zerosLength = !sequence.minDigits
    ? 0
    : sequence.minDigits - sequenceStringified.length;
  const transactionNo = `${new Array(zerosLength)
    .fill("0")
    .join("")}${sequenceStringified}`;

  await db.transaction(async (tx) => {
    const [createdTransaction] = await tx
      .insert(Transaction)
      .values({
        customerId,
        serviceType,
        userId,
        transactionNo,
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

    await tx
      .update(Sequence)
      .set({ currentSequence: nextSequence })
      .where(eq(Sequence.id, sequence.id));
  });

  res.status(201).json({ message: "Success create transaction" });
}
