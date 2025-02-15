import { Request, Response } from "express";
import { Currency } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function deleteCurrencyController(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const deletedCurrency = await db.delete(Currency).where(eq(Currency.id, +id));

  if (!deletedCurrency.rowCount) {
    res.status(404).json({ message: "Currency not found" });
    return;
  }

  res.status(200).json({ message: "Currency data deleted" });
}
