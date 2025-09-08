import { User, UserLaundry, UserRole } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, Role } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function putInactiveUserController(
  req: IAuthRequest,
  res: Response
) {
  const params = req.params as { userId: string };
  const userRoles = req.userRoles;

  const queryUserRoles = await db.query.UserRole.findMany({
    where: eq(UserRole.userId, +params.userId),
    with: {
      role: {
        columns: { identifier: true },
      },
    },
    columns: {},
  });

  if (userRoles?.includes(Role.STAFF)) {
    res.status(403).json({ message: "Unable to do this action for staff." });
    return;
  }

  if (
    userRoles?.includes(Role.OWNER) &&
    !queryUserRoles.some((role) => role.role.identifier === Role.STAFF)
  ) {
    res
      .status(403)
      .json({ message: "You only able to inactive the staff user." });
    return;
  }

  if (
    userRoles?.includes(Role.SUPER_ADMIN) &&
    !queryUserRoles.some((role) => role.role.identifier === Role.OWNER)
  ) {
    res
      .status(403)
      .json({ message: "You only able to inactive the owner user." });
    return;
  }

  await db
    .update(UserLaundry)
    .set({ isActive: false })
    .where(eq(UserLaundry.userId, +params.userId));

  res.status(200).json({ message: "Success inactive user" });
}
