import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { IPutUpdateCustomerContactDto } from "@/utils";
import { db } from "@/services";
import { Contact, CustomerContact } from "@/schemas";

export async function putUpdateCustomerContactController(
  req: Request,
  res: Response
) {
  const { id, contactId } = req.params as { id: string; contactId: string };
  const { whatsappPhone }: IPutUpdateCustomerContactDto = req.body;

  const customerContact = await db.query.CustomerContact.findFirst({
    where: and(
      eq(CustomerContact.customerId, +id),
      eq(CustomerContact.contactId, +contactId)
    ),
  });

  if (!customerContact) {
    res.status(404).json({ message: "Contact not found for this customer" });
    return;
  }

  await db
    .update(Contact)
    .set({ details: whatsappPhone })
    .where(eq(Contact.id, +contactId));

  res.status(200).json({ message: "Success update customer contact" });
}
