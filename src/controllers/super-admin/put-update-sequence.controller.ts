import { Request, Response } from "express";
import { IPutUpdateSequenceDto } from "@/utils";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { Sequence } from "@/schemas";

export async function putUpdateSequenceController(req: Request, res: Response) {
  const params = req.params as { id: string };
  const { name, minDigits, currentSequence }: IPutUpdateSequenceDto = req.body;

  const updatedSequence = await db
    .update(Sequence)
    .set({ name, minDigits, currentSequence })
    .where(eq(Sequence.id, +params.id));

  if (!updatedSequence.rowCount) {
    res.status(404).json({ message: "Sequence not found" });
    return;
  }

  res.status(200).json({ message: "Success update sequence" });
}
