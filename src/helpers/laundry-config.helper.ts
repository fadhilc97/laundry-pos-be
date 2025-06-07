import { and, eq } from "drizzle-orm";
import { LaundryConfig, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { HelperOptions } from "@/utils";

export async function getCurrentLaundryConfig(options: HelperOptions) {
  const { configKey, userId, res } = options;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    columns: { laundryId: true },
  });

  if (!userLaundry) {
    res.status(404).json({ message: "You're not registered in your laundry" });
    return;
  }

  const laundryConfig = await db.query.LaundryConfig.findFirst({
    where: and(
      eq(LaundryConfig.laundryId, userLaundry.laundryId),
      eq(LaundryConfig.key, configKey)
    ),
    columns: { value: true },
  });

  return laundryConfig;
}
