import { Location, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { IPostCreateLocationDto } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function postCreateLocationController(
  req: IAuthRequest,
  res: Response
) {
  const userId = req.userId as number;
  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    columns: {
      laundryId: true,
    },
  });

  if (!userLaundry?.laundryId) {
    res.status(404).json({ message: "Your laundry doesn't belong to you" });
    return;
  }

  const { name }: IPostCreateLocationDto = req.body;
  await db.insert(Location).values({
    name,
    laundryId: userLaundry?.laundryId,
  });

  res.status(201).json({ message: "Location data created" });
}
