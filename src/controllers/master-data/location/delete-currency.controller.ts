import { Request, Response } from "express";
import { Location } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function deleteLocationController(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const deletedLocation = await db.delete(Location).where(eq(Location.id, +id));

  if (!deletedLocation.rowCount) {
    res.status(404).json({ message: "Location not found" });
    return;
  }

  res.status(200).json({ message: "Location data deleted" });
}
