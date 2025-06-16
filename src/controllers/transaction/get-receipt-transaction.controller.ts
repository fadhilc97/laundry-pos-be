import { getHtmlOutput } from "@/services";
import { Request, Response } from "express";

export function getReceiptTransactionController(req: Request, res: Response) {
  const receiptHtmlOutput = getHtmlOutput("receipt");
  res
    .status(200)
    .json({ message: "Success get receipt", data: receiptHtmlOutput });
}
