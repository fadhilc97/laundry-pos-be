import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/services";
import { Sequence } from "@/schemas";

export async function deleteSequenceController(req: Request, res: Response) {
  const params = req.params as { id: string };

  const deletedSequence = await db
    .delete(Sequence)
    .where(eq(Sequence.id, +params.id));

  if (!deletedSequence.rowCount) {
    res.status(404).json({ message: "Sequence not found" });
  }

  res.status(200).json({ message: "Success delete sequence" });
}
