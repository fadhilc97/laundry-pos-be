import { Request, Response } from "express";
import { QuantityUnit } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function deleteQuantityUnitController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };

  const deletedQuantityUnit = await db
    .delete(QuantityUnit)
    .where(eq(QuantityUnit.id, +id));

  if (!deletedQuantityUnit.rowCount) {
    res.status(404).json({ message: "Quantity unit not found" });
    return;
  }

  res.status(200).json({ message: "Quantity unit data deleted" });
}
