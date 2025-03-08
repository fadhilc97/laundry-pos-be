import { Request, Response } from "express";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { LaundryConfig } from "@/schemas";
import { IPostCreateLaundryConfigDto } from "@/utils";

export async function postCreateLaundryConfigController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const body: IPostCreateLaundryConfigDto[] = req.body;

  const laundryConfigs = await db.query.LaundryConfig.findMany({
    where: eq(LaundryConfig.laundryId, +id),
    columns: {
      key: true,
    },
  });

  const laundryConfigKeys = laundryConfigs.map((config) => config.key);
  const filteredBody = body
    .map((b) => ({ ...b, laundryId: +id }))
    .filter((b) => !laundryConfigKeys.includes(b.key));

  if (!filteredBody.length) {
    res.status(422).json({ message: "Configuration already exists" });
  }
  await db.insert(LaundryConfig).values(filteredBody);

  res.status(201).json({ message: "Created laundry configuration" });
}
