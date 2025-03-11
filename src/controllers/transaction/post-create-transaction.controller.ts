import { Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@/services";
import {
  Transaction,
  TransactionItem,
  UserLaundry,
  LaundryConfig,
  Sequence,
} from "@/schemas";
import { IAuthRequest, IPostCreateTransactionDto } from "@/utils";

export async function postCreateTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId as number;
  const { customerId, serviceType, items }: IPostCreateTransactionDto =
    req.body;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    columns: { laundryId: true },
  });

  if (!userLaundry) {
    res.status(404).json({ message: "You're not registered in your laundry" });
    return;
  }

  const laundryConfig = await db.query.LaundryConfig.findFirst({
    where: and(
      eq(LaundryConfig.laundryId, userLaundry.laundryId),
      eq(LaundryConfig.key, "transaction_sequence_id")
    ),
    columns: { value: true },
  });

  if (!laundryConfig) {
    res.status(404).json({
      message:
        "The transaction sequence is not configured to your laundry. Please contact our system support",
    });
    return;
  }

  const sequence = await db.query.Sequence.findFirst({
    where: eq(Sequence.id, +laundryConfig.value),
    columns: {
      minDigits: true,
      currentSequence: true,
    },
  });

  if (!sequence) {
    res.status(404).json({ message: "Sequence not found" });
    return;
  }

  const sequenceStringified = sequence.currentSequence.toString();
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
      .where(eq(Sequence.id, +laundryConfig.value));
  });

  res.status(201).json({ message: "Success create transaction" });
}
