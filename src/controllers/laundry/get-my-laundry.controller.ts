import { IAuthRequest } from "@/utils";
import { Response } from "express";
import { db } from "@/services";
import { Laundry, UserLaundry } from "@/schemas";
import { eq } from "drizzle-orm";

export async function getMyLaundryController(req: IAuthRequest, res: Response) {
  const { userId } = req;

  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId as number),
    with: { laundry: true },
    // columns: {}
  });

  res.status(200).json({
    message: "Your laundry data already retrieved",
    data: userLaundry?.laundry,
  });
}
