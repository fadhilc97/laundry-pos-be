import { Location, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function getListLocationController(
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

  const locations = await db.query.Location.findMany({
    where: eq(Location.laundryId, userLaundry.laundryId),
  });

  res.status(201).json({ message: "Success get locations", data: locations });
}
