import { IPutUpdateLocationDto } from "@/utils";
import { Location } from "@/schemas";
import { Request, Response } from "express";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function putUpdateLocationController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { name }: IPutUpdateLocationDto = req.body;

  const updatedLocation = await db
    .update(Location)
    .set({ name })
    .where(eq(Location.id, +id));

  if (!updatedLocation.rowCount) {
    res.status(404).json({ message: "Location not found" });
    return;
  }

  res.status(200).json({ message: "Location data updated" });
}
