import { Request, Response } from "express";
import { db } from "@/services";

export async function getListSequenceController(_: Request, res: Response) {
  const sequences = await db.query.Sequence.findMany();

  res
    .status(200)
    .json({ message: "Success get list sequences", data: sequences });
}
