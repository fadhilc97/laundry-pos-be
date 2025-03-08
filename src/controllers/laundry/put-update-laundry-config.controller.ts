import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { IPutUpdateLaundryConfigDto } from "@/utils";
import { LaundryConfig } from "@/schemas";
import { db } from "@/services";

export async function putUpdateLaundryConfigController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { key, name, value }: IPutUpdateLaundryConfigDto = req.body;

  const laundryConfig = await db.query.LaundryConfig.findFirst({
    where: and(eq(LaundryConfig.key, key), eq(LaundryConfig.laundryId, +id)),
  });

  if (!laundryConfig) {
    res.status(404).json({ message: "Laundry configuration not found" });
    return;
  }

  await db
    .update(LaundryConfig)
    .set({ key, name, value })
    .where(and(eq(LaundryConfig.key, key), eq(LaundryConfig.laundryId, +id)));

  res.status(200).json({ message: "Success update laundry configuration" });
}
