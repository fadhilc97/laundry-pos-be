import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { eq } from "drizzle-orm";
import { User } from "@/schemas";

export async function getMyProfileController(req: IAuthRequest, res: Response) {
  const userId = req.userId as number;

  const user = await db.query.User.findFirst({
    where: eq(User.id, userId),
    columns: {
      name: true,
      imageUrl: true,
      email: true,
    },
  });

  res
    .status(200)
    .json({ message: "Success get your profile data.", data: user });
}
