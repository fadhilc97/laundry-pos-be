import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest, IPostCreateLaundryDto } from "@/utils";
import { Laundry, Contact, LaundryContact, UserLaundry } from "@/schemas";
import { eq } from "drizzle-orm";

export async function postCreateLaundryController(
  req: IAuthRequest,
  res: Response
) {
  console.log(req);
  const { name, address, contacts }: IPostCreateLaundryDto = req.body;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, 1),
  });

  if (userLaundry) {
    res.status(422).json({ message: "You have already create laundry data" });
    return;
  }

  await db.transaction(async (tx) => {
    const [createdLaundry] = await tx
      .insert(Laundry)
      .values({ name, address })
      .returning({ id: Laundry.id });

    const createdContacts = await tx
      .insert(Contact)
      .values([
        {
          name: "WHATSAPP",
          details: contacts.whatsapp,
          laundryId: createdLaundry.id,
        },
        {
          name: "PHONE",
          details: contacts.phone,
          laundryId: createdLaundry.id,
        },
        {
          name: "EMAIL",
          details: contacts.email,
          laundryId: createdLaundry.id,
        },
        {
          name: "INSTAGRAM",
          details: contacts.instagram,
          laundryId: createdLaundry.id,
        },
        {
          name: "WEBSITE",
          details: contacts.website,
          laundryId: createdLaundry.id,
        },
      ])
      .returning({ id: Contact.id });

    await tx.insert(LaundryContact).values(
      createdContacts.map((contact) => ({
        laundryId: createdLaundry.id,
        contactId: contact.id,
      }))
    );

    await tx
      .insert(UserLaundry)
      .values({ userId: req.userId as number, laundryId: createdLaundry.id });
  });

  res.status(201).json({ message: "Laundry data created" });
}
