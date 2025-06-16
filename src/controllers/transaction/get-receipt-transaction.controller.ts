import { getHtmlToPdf } from "@/services";
import { Request, Response } from "express";

export async function getReceiptTransactionController(
  req: Request,
  res: Response
) {
  await getHtmlToPdf("receipt", "receipt.pdf");
  res.status(200).json({ message: "Success get receipt" });
}
