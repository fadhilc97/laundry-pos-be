import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest, IPutUpdateUserDto } from "@/utils";
import { UserRole } from "@/schemas";
import { eq } from "drizzle-orm";

export async function putUpdateUserController(
  req: IAuthRequest,
  res: Response
) {
  const { roleIds }: IPutUpdateUserDto = req.body;
  const params = req.params as { userId: string };

  await db.transaction(async (tx) => {
    await tx.delete(UserRole).where(eq(UserRole.userId, +params.userId));
    await tx.insert(UserRole).values(
      roleIds.map((roleId) => ({
        userId: +params.userId,
        roleId,
      }))
    );
  });

  res.status(200).json({
    message: "Success update user",
  });
}
