import { getHtmlToPdf } from "@/services";
import { Request, Response } from "express";
import path from "path";

export async function postGenerateReceiptTransactionController(
  req: Request,
  res: Response
) {
  const fileStorePath = process.env.FILESTORE_PATH as string;
  const pdfPath = path.join(fileStorePath, "receipts", "receipt.pdf");
  await getHtmlToPdf("receipt", pdfPath);
  res.status(200).json({ message: "Success generate receipt" });
}
