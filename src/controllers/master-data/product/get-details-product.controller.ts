import { Product, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function getDetailsProductController(
  req: IAuthRequest,
  res: Response
) {
  const { id } = req.params as { id: string };

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

  const product = await db.query.Product.findFirst({
    where: eq(Product.id, +id),
    columns: {
      name: true,
      price: true,
      serviceType: true,
      currencyId: true,
      qtyUnitId: true,
    },
  });

  res.status(200).json({
    message: "Success get product list",
    data: { ...product, price: +(product?.price || "0") },
  });
}
