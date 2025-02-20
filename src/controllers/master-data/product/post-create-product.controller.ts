import { Response } from "express";
import { IAuthRequest, IPostCreateProductDto } from "@/utils";
import { Product, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function postCreateProductController(
  req: IAuthRequest,
  res: Response
) {
  const {
    name,
    price,
    qtyUnitId,
    currencyId,
    serviceType,
  }: IPostCreateProductDto = req.body;

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

  await db.insert(Product).values({
    name,
    price: price.toString(),
    qtyUnitId,
    currencyId,
    serviceType,
    laundryId: userLaundry?.laundryId,
  });

  res.status(201).json({ message: "Product data created" });
}
