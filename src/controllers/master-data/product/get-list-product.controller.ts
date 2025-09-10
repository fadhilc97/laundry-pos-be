import { Response } from "express";
import { Product, ServiceType, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { and, eq } from "drizzle-orm";
import { IAuthRequest } from "@/utils";

export type Query = {
  serviceType: ServiceType;
};

export async function getListProductController(
  req: IAuthRequest,
  res: Response
) {
  const { serviceType } = req.query as Query;
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
    where: and(
      eq(Product.laundryId, userLaundry?.laundryId),
      serviceType && eq(Product.serviceType, serviceType)
    ),
    columns: {
      id: true,
      name: true,
      price: true,
    },
    with: {
      quantityUnit: {
        columns: { shortName: true, id: true, decimalPlaces: true },
      },
      currency: {
        columns: { symbol: true },
      },
    },
  });

  res.status(200).json({
    message: "Success get products",
    data: products,
  });
}
