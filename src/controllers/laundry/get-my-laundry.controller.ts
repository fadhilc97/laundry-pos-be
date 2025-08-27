import { IAuthRequest } from "@/utils";
import { Response } from "express";
import { db } from "@/services";
import { Currency, LaundryConfig, UserLaundry } from "@/schemas";
import { eq } from "drizzle-orm";

export async function getMyLaundryController(req: IAuthRequest, res: Response) {
  const { userId } = req;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId as number),
    with: {
      laundry: {
        with: {
          laundryConfig: {
            columns: { value: true },
            where: eq(LaundryConfig.key, "currency_id"),
          },
          laundryContacts: {
            with: {
              contact: {
                columns: { id: true, name: true, details: true },
              },
            },
            columns: {},
          },
        },
      },
    },
  });

  const defaultCurrencyConfig = userLaundry?.laundry.laundryConfig[0];
  const defaultCurrency = await db.query.Currency.findFirst({
    where: eq(Currency.id, +(defaultCurrencyConfig?.value as string)),
    columns: { name: true, symbol: true },
  });

  res.status(200).json({
    message: "Your laundry data already retrieved",
    data: {
      name: userLaundry?.laundry.name,
      address: userLaundry?.laundry.address,
      imageUrl: userLaundry?.laundry.imageUrl,
      currency: `${defaultCurrency?.name} (${defaultCurrency?.symbol})`,
      contacts: userLaundry?.laundry.laundryContacts.map((contact) => ({
        id: contact.contact.id,
        name: contact.contact.name,
        details: contact.contact.details,
      })),
    },
  });
}
