import { Transaction } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import path from "path";

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

  const fileStorePath = process.env.FILESTORE_PATH as string;
  const pdfPath = path.join(fileStorePath, transaction?.receiptPath);

  res.download(pdfPath);
}
