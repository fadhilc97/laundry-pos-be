import { IPutUpdateCurrencyDto } from "@/utils";
import { Currency } from "@/schemas";
import { Request, Response } from "express";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function putUpdateCurrencyController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { name, shortName, countryName, symbol }: IPutUpdateCurrencyDto =
    req.body;

  const updatedCurrency = await db
    .update(Currency)
    .set({ name, shortName, countryName, symbol })
    .where(eq(Currency.id, +id));

  if (!updatedCurrency.rowCount) {
    res.status(404).json({ message: "Currency not found" });
    return;
  }

  res.status(200).json({ message: "Currency data updated" });
}
