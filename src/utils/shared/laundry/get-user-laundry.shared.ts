import { UserLaundry } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function getUserLaundryShared(userId: number) {
  return await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    with: {
      laundry: {
        with: {
          laundryUsers: {
            columns: {
              userId: true,
            },
          },
        },
        columns: {},
      },
    },
    columns: {},
  });
}
