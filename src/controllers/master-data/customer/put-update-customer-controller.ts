import { Response } from "express";
import { eq } from "drizzle-orm";
import { IAuthRequest, IPutUpdateCustomerDto } from "@/utils";
import { db } from "@/services";
import { Contact, Customer, CustomerContact } from "@/schemas";

export async function putUpdateCustomerController(
  req: IAuthRequest,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { name, address, whatsappPhone }: IPutUpdateCustomerDto = req.body;

  const customerContact = await db.query.CustomerContact.findFirst({
    where: eq(CustomerContact.customerId, +id),
    columns: {
      contactId: true,
    },
  });

  await db.transaction(async (tx) => {
    await tx
      .update(Contact)
      .set({
        details: whatsappPhone,
      })
      .where(eq(Contact.id, customerContact?.contactId as number));

    const updatedCustomer = await tx
      .update(Customer)
      .set({ name, address })
      .where(eq(Customer.id, +id));

    if (!updatedCustomer.rowCount) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
  });

  res.status(200).json({ message: "Success update customer" });
}
