import { Request, Response } from "express";
import { db } from "@/services";
import { Sequence } from "@/schemas";
import { IPostCreateSequenceDto } from "@/utils";

export async function postCreateSequenceController(
  req: Request,
  res: Response
) {
  const { name, minDigits, currentSequence }: IPostCreateSequenceDto = req.body;

  await db.insert(Sequence).values({ name, minDigits, currentSequence });

  res.status(201).json({ message: "Success create sequence" });
}
