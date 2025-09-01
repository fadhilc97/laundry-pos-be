import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest, IPostCreateLaundryDto } from "@/utils";
import {
  Laundry,
  Contact,
  LaundryContact,
  UserLaundry,
  CustomerContact,
} from "@/schemas";
import { and, eq, inArray, isNull } from "drizzle-orm";

interface IPutMyLaundryDto extends IPostCreateLaundryDto {}

export async function putUpdateMyLaundryController(
  req: IAuthRequest,
  res: Response
) {
  const { name, address, contacts }: IPutMyLaundryDto = req.body;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, req.userId as number),
    columns: {
      laundryId: true,
    },
  });

  if (!userLaundry) {
    res.status(404).json({ message: "Laundry data not found" });
    return;
  }

  const nullCustomerContacts = await db
    .select({
      contactId: Contact.id,
    })
    .from(Contact)
    .leftJoin(CustomerContact, eq(CustomerContact.contactId, Contact.id))
    .where(isNull(CustomerContact.id));

  await db.transaction(async (tx) => {
    await tx
      .update(Laundry)
      .set({ name, address })
      .where(eq(Laundry.id, userLaundry.laundryId));

    await tx
      .delete(LaundryContact)
      .where(eq(LaundryContact.laundryId, userLaundry.laundryId));

    await tx.delete(Contact).where(
      and(
        eq(Contact.laundryId, userLaundry.laundryId),
        inArray(
          Contact.id,
          nullCustomerContacts.map((contact) => contact.contactId)
        )
      )
    );

    const createdContacts = await tx
      .insert(Contact)
      .values([
        {
          name: "WHATSAPP",
          details: contacts.whatsapp,
          laundryId: userLaundry.laundryId,
        },
        {
          name: "PHONE",
          details: contacts.phone,
          laundryId: userLaundry.laundryId,
        },
        {
          name: "EMAIL",
          details: contacts.email,
          laundryId: userLaundry.laundryId,
        },
        {
          name: "INSTAGRAM",
          details: contacts.instagram,
          laundryId: userLaundry.laundryId,
        },
        {
          name: "WEBSITE",
          details: contacts.website,
          laundryId: userLaundry.laundryId,
        },
      ])
      .returning({ id: Contact.id });

    await tx.insert(LaundryContact).values(
      createdContacts.map((contact) => ({
        laundryId: userLaundry.laundryId,
        contactId: contact.id,
      }))
    );
  });

  res.status(200).json({ message: "Laundry data updated" });
}
