import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/services";
import { Product } from "@/schemas";

export async function deleteProductController(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const deletedProduct = await db.delete(Product).where(eq(Product.id, +id));

  if (!deletedProduct.rowCount) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json({ message: "Product deleted" });
}
