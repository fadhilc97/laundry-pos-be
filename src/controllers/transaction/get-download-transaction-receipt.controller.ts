import { Transaction } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { getFileStream } from "@/services";

type Params = {
  id: string;
};

export async function getDownloadTransactionReceiptController(
  req: Request,
  res: Response
) {
  const { id } = req.params as Params;
  const transaction = await db.query.Transaction.findFirst({
    where: eq(Transaction.id, +id),
    columns: {
      transactionNo: true,
      receiptPath: true,
    },
  });

  if (!transaction?.receiptPath) {
    res.status(404).json({ message: "Receipt not found!" });
    return;
  }

  const receiptReadable = getFileStream(transaction.receiptPath);

  res.attachment(transaction.receiptPath);
  receiptReadable.on("error", (err) =>
    res
      .status(500)
      .json({ message: "Fail to download receipt", error: err.message })
  );
  receiptReadable.pipe(res);
}
