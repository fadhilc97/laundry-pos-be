import { HelperOptions } from "@/utils";
import { getCurrentLaundryConfig } from "@/helpers";
import { db } from "@/services";
import { eq } from "drizzle-orm";
import { Currency } from "@/schemas";

export async function getCurrentLaundryCurrency(options: HelperOptions) {
  const { res } = options;
  const currencyConfig = await getCurrentLaundryConfig(options);

  if (!currencyConfig) {
    res.status(404).json({
      message: "Your configuration for currency is not available yet",
    });
    return;
  }

  const currency = await db.query.Currency.findFirst({
    where: eq(Currency.id, +currencyConfig?.value),
    columns: { id: true },
  });

  return currency;
}
