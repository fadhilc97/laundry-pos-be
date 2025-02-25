import { Response } from "express";
import { db } from "@/services";
import { Transaction, TransactionItem } from "@/schemas";
import { IAuthRequest, IPostCreateTransactionDto } from "@/utils";

export async function postCreateTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId as number;
  const { customerId, serviceType, items }: IPostCreateTransactionDto =
    req.body;

  await db.transaction(async (tx) => {
    const [createdTransaction] = await tx
      .insert(Transaction)
      .values({
        customerId,
        serviceType,
        userId,
        transactionNo: "0000", // TODO: Will be using sequence system
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
  });

  res.status(201).json({ message: "Success create transaction" });
}
