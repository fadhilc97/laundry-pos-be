import { eq, and } from "drizzle-orm";
import { Response } from "express";
import { UserLaundry, Customer, Contact, CustomerContact } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, IPostCreateCustomerDto } from "@/utils";

export async function postCreateCustomerController(
  req: IAuthRequest,
  res: Response
) {
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

  const { name, address, whatsappPhone }: IPostCreateCustomerDto = req.body;

  await db.transaction(async (tx) => {
    const [createdCustomer] = await tx
      .insert(Customer)
      .values({ name, address, laundryId: userLaundry.laundryId })
      .returning({ id: Customer.id });

    const foundedContact = await tx.query.Contact.findFirst({
      where: and(
        eq(Contact.name, "WHATSAPP"),
        eq(Contact.details, whatsappPhone)
      ),
    });

    let insertContactId: number;
    if (foundedContact) {
      insertContactId = foundedContact.id;
    } else {
      const [createdContact] = await tx
        .insert(Contact)
        .values({
          name: "WHATSAPP",
          details: whatsappPhone,
          laundryId: userLaundry.laundryId,
        })
        .returning({ id: Contact.id });
      insertContactId = createdContact.id;
    }

    await tx.insert(CustomerContact).values({
      customerId: createdCustomer.id,
      contactId: insertContactId,
    });
  });

  res.status(201).json({ message: "Success create customer" });
}
