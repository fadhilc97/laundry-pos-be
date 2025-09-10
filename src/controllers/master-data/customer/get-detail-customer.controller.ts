import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/services";
import { Customer, Contact, CustomerContact } from "@/schemas";

export async function getDetailCustomerController(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const customer = await db.query.Customer.findFirst({
    columns: {
      id: true,
      name: true,
      address: true,
    },
    with: {
      customerContacts: {
        columns: {},
        with: {
          contact: {
            columns: { id: true, name: true, details: true },
          },
        },
      },
    },
    where: eq(Customer.id, +id),
  });

  const customerContact = customer?.customerContacts.find(
    (contact) => contact.contact.name === "WHATSAPP"
  );

  const data = {
    name: customer?.name,
    address: customer?.address,
    whatsappPhone: customerContact?.contact.details,
  };

  res.status(200).json({ message: "Success get customer details", data });
}
