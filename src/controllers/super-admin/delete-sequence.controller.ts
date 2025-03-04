import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/services";
import { Sequence } from "@/schemas";

export async function deleteSequenceController(req: Request, res: Response) {
  const params = req.params as { id: string };

  await db.delete(Sequence).where(eq(Sequence.id, +params.id));

  res.status(200).json({ message: "Success delete sequence" });
}
