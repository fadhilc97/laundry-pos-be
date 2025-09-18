import { Currency, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { and, eq } from "drizzle-orm";
import { Response } from "express";

export async function getDetailCurrencyController(
  req: IAuthRequest,
  res: Response
) {
  const params = req.params as { id: string };
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

  const currency = await db.query.Currency.findFirst({
    where: and(
      eq(Currency.id, +params.id),
      eq(Currency.laundryId, userLaundry.laundryId)
    ),
  });

  res.status(200).json({
    message: "Success get currency detail",
    data: currency,
  });
}
