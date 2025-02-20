import { Product } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, IPutUpdateProductDto } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function putUpdateProductController(
  req: IAuthRequest,
  res: Response
) {
  const { id } = req.params as { id: string };
  const {
    name,
    price,
    qtyUnitId,
    currencyId,
    serviceType,
  }: IPutUpdateProductDto = req.body;

  const updateProduct = await db
    .update(Product)
    .set({ name, price: price.toString(), qtyUnitId, currencyId, serviceType })
    .where(eq(Product.id, +id));

  if (!updateProduct.rowCount) {
    res.status(400).json({ message: "Product not found" });
    return;
  }

  res.status(200).json({ message: "Product data updated" });
}
