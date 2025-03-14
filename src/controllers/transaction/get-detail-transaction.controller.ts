import { Request, Response } from "express";
import { db } from "@/services";
import { Transaction } from "@/schemas";
import { eq } from "drizzle-orm";

export async function getDetailTransactionController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };

  const transaction = await db.query.Transaction.findFirst({
    where: eq(Transaction.id, +id),
    with: {
      items: true,
      payments: true,
    },
  });

  res
    .status(200)
    .json({ message: "Success get detail transaction", data: transaction });
}
