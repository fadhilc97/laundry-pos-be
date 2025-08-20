import { hash } from "bcrypt";
import { Role, User, UserLaundry, UserRole } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, IPostCreateUserDto, Role as RoleEnum } from "@/utils";
import { inArray } from "drizzle-orm";
import { Response } from "express";

export async function postCreateUserController(
  req: IAuthRequest,
  res: Response
) {
  const userRoles = req.userRoles;
  const { name, email, password, laundryId, roleIds }: IPostCreateUserDto =
    req.body;

  const roles = await db.query.Role.findMany({
    where: inArray(Role.id, roleIds),
    columns: {
      identifier: true,
    },
  });

  if (roles.some((role) => role.identifier === RoleEnum.SUPER_ADMIN)) {
    res
      .status(400)
      .json({ message: "You're unable to create super admin user" });
    return;
  }

  if (userRoles?.includes(RoleEnum.STAFF)) {
    res.status(400).json({ message: "You're unable to create user" });
    return;
  }

  if (
    userRoles?.includes(RoleEnum.OWNER) &&
    roles.some((role) => role.identifier === RoleEnum.OWNER)
  ) {
    res.status(400).json({ message: "You're unable to create owner user" });
    return;
  }

  const encryptedPassword = await hash(password, 10);
  await db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(User)
      .values({
        name,
        email,
        password: encryptedPassword,
      })
      .returning({ id: User.id });

    if (laundryId) {
      await tx.insert(UserLaundry).values({
        userId: createdUser.id,
        laundryId,
      });
    }

    await tx.insert(UserRole).values(
      roleIds.map((roleId) => ({
        userId: createdUser.id,
        roleId,
      }))
    );
  });

  res.status(201).json({ message: "User data created" });
}
