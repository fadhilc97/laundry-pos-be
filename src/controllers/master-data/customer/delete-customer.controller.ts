import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/services";
import { Customer } from "@/schemas";

export async function deleteCustomerController(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const deletedCustomer = await db.delete(Customer).where(eq(Customer.id, +id));

  if (!deletedCustomer.rowCount) {
    res.status(404).json({ message: "Customer not found" });
    return;
  }

  res.status(200).json({ message: "Success delete customer" });
}
