import { Product } from "@/schemas";
import { db } from "@/services";
import { IPutUpdateProductDto } from "@/utils";
import { eq } from "drizzle-orm";
import { Response, Request } from "express";

export async function putUpdateProductController(req: Request, res: Response) {
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
