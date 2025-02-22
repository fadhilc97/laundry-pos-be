import { Currency, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { IPostCreateCurrencyDto } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function postCreateCurrencyController(
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

  const { name, shortName, countryName, symbol }: IPostCreateCurrencyDto =
    req.body;
  await db.insert(Currency).values({
    name,
    shortName,
    countryName,
    symbol: symbol || shortName,
    laundryId: userLaundry?.laundryId,
  });

  res.status(201).json({ message: "Currency data created" });
}
