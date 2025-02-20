import { Response } from "express";
import { Product } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { IAuthRequest } from "@/utils";

export async function getListProductController(
  req: IAuthRequest,
  res: Response
) {
  const products = await db.query.Product.findMany({
    where: eq(Product.laundryId, +(req.userId as number)),
  });

  res.status(200).json({
    message: "Success get products",
    data: products,
  });
}
