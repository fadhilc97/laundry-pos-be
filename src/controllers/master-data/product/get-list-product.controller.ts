import { Response } from "express";
import { Product, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { IAuthRequest } from "@/utils";

export async function getListProductController(
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

  const products = await db.query.Product.findMany({
    where: eq(Product.laundryId, userLaundry?.laundryId),
  });

  res.status(200).json({
    message: "Success get products",
    data: products,
  });
}
