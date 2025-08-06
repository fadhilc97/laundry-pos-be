import { QuantityUnit, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { IPostCreateQuantityUnitDto } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function postCreateQuantityUnitController(
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

  const { name, shortName, decimalPlaces }: IPostCreateQuantityUnitDto =
    req.body;
  await db.insert(QuantityUnit).values({
    name,
    shortName,
    decimalPlaces,
    laundryId: userLaundry?.laundryId,
  });

  res.status(201).json({ message: "Quantity unit data created" });
}
