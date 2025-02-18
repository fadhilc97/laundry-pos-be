import { IPutUpdateQuantityUnitDto } from "@/utils";
import { QuantityUnit } from "@/schemas";
import { Request, Response } from "express";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function putUpdateQuantityUnitController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { name, shortName }: IPutUpdateQuantityUnitDto = req.body;

  const updatedQuantityUnit = await db
    .update(QuantityUnit)
    .set({ name, shortName })
    .where(eq(QuantityUnit.id, +id));

  if (!updatedQuantityUnit.rowCount) {
    res.status(404).json({ message: "Quantity unit not found" });
    return;
  }

  res.status(200).json({ message: "Quantity unit data updated" });
}
