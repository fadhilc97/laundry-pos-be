import { Response } from "express";
import { eq } from "drizzle-orm";
import { IAuthRequest, IPutUpdateCustomerDto } from "@/utils";
import { db } from "@/services";
import { Customer } from "@/schemas";

export async function putUpdateCustomerController(
  req: IAuthRequest,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { name, address }: IPutUpdateCustomerDto = req.body;

  const updatedCustomer = await db
    .update(Customer)
    .set({ name, address })
    .where(eq(Customer.id, +id));

  if (!updatedCustomer.rowCount) {
    res.status(404).json({ message: "Customer not found" });
    return;
  }

  res.status(200).json({ message: "Success update customer" });
}
