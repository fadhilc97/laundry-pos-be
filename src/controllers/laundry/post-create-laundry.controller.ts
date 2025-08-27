import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest, IPostCreateLaundryDto } from "@/utils";
import {
  Laundry,
  Contact,
  LaundryContact,
  UserLaundry,
  Sequence,
  Currency,
  LaundryConfig,
  QuantityUnit,
  Location,
  Product,
} from "@/schemas";
import { eq } from "drizzle-orm";

export async function postCreateLaundryController(
  req: IAuthRequest,
  res: Response
) {
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

    // Create sequences: transaction and payment
    const [createdTransactionSequence, createdPaymentSequence] = await tx
      .insert(Sequence)
      .values([
        {
          name: "Transaction Sequence",
          minDigits: 4,
          laundryId: createdLaundry.id,
        },
        {
          name: "Payment Sequence",
          minDigits: 4,
          laundryId: createdLaundry.id,
        },
      ])
      .returning({ id: Sequence.id });

    // Create currency samples
    const [createdCurrency] = await tx
      .insert(Currency)
      .values([
        {
          name: "Rupiah",
          countryName: "Indonesia",
          shortName: "IDR",
          symbol: "Rp",
          laundryId: createdLaundry.id,
        },
      ])
      .returning({ id: Currency.id });

    // Create laundry default configuration: transaction sequence, payment sequence and currency sequence
    await tx.insert(LaundryConfig).values([
      {
        key: "transaction_sequence_id",
        name: "Transaction Sequence",
        value: createdTransactionSequence.id.toString(),
        laundryId: createdLaundry.id,
      },
      {
        key: "payment_sequence_id",
        name: "Payment Sequence",
        value: createdPaymentSequence.id.toString(),
        laundryId: createdLaundry.id,
      },
      {
        key: "currency_id",
        name: "Currency",
        value: createdCurrency.id.toString(),
        laundryId: createdLaundry.id,
      },
    ]);

    // Create other samples: quantity units, locations and products
    const [createdSetUnit, createdKgUnit] = await tx
      .insert(QuantityUnit)
      .values([
        {
          name: "Sets",
          decimalPlaces: 0,
          shortName: "set(s)",
          laundryId: createdLaundry.id,
        },
        {
          name: "Kilogram",
          decimalPlaces: 1,
          shortName: "kg",
          laundryId: createdLaundry.id,
        },
      ])
      .returning({ id: QuantityUnit.id });

    await tx.insert(Location).values([
      { name: "Row 1 Column 1", laundryId: createdLaundry.id },
      { name: "Row 1 Column 2", laundryId: createdLaundry.id },
      { name: "Row 1 Column 3", laundryId: createdLaundry.id },
      { name: "Row 1 Column 4", laundryId: createdLaundry.id },
      { name: "Row 2 Column 1", laundryId: createdLaundry.id },
      { name: "Row 2 Column 2", laundryId: createdLaundry.id },
      { name: "Row 2 Column 3", laundryId: createdLaundry.id },
      { name: "Row 2 Column 4", laundryId: createdLaundry.id },
    ]);

    await tx.insert(Product).values([
      {
        name: "Common Clothes",
        currencyId: createdCurrency.id,
        qtyUnitId: createdKgUnit.id,
        serviceType: "REGULAR",
        price: "6000",
        laundryId: createdLaundry.id,
      },
      {
        name: "Common Clothes",
        currencyId: createdCurrency.id,
        qtyUnitId: createdKgUnit.id,
        serviceType: "EXPRESS",
        price: "7000",
        laundryId: createdLaundry.id,
      },
      {
        name: "Common Clothes",
        currencyId: createdCurrency.id,
        qtyUnitId: createdKgUnit.id,
        serviceType: "FLASH",
        price: "8000",
        laundryId: createdLaundry.id,
      },
      {
        name: "Sprei Bed",
        currencyId: createdCurrency.id,
        qtyUnitId: createdSetUnit.id,
        serviceType: "REGULAR",
        price: "10000",
        laundryId: createdLaundry.id,
      },
      {
        name: "Sprei Bed",
        currencyId: createdCurrency.id,
        qtyUnitId: createdSetUnit.id,
        serviceType: "EXPRESS",
        price: "11000",
        laundryId: createdLaundry.id,
      },
      {
        name: "Sprei Bed",
        currencyId: createdCurrency.id,
        qtyUnitId: createdSetUnit.id,
        serviceType: "FLASH",
        price: "12000",
        laundryId: createdLaundry.id,
      },
    ]);
  });

  res.status(201).json({ message: "Laundry data created" });
}
