import { eq } from "drizzle-orm";
import { Response } from "express";
import { Customer, UserLaundry } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";

export async function getListCustomerController(
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

  const customers = await db.query.Customer.findMany({
    where: eq(Customer.laundryId, userLaundry.laundryId),
  });

  res.status(200).json({ message: "Success get customers", data: customers });
}
