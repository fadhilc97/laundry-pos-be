import { Response } from "express";
import { db } from "@/services";
import { IAuthRequest } from "@/utils";
import { notInArray } from "drizzle-orm";
import { Role } from "@/schemas";
import { Role as RoleEnum } from "@/utils";

export async function getListRoleController(req: IAuthRequest, res: Response) {
  const userRoles = req.userRoles || [];

  const roles = await db.query.Role.findMany({
    columns: {
      id: true,
      name: true,
      identifier: true,
    },
    where: notInArray(Role.identifier, [...userRoles, RoleEnum.SUPER_ADMIN]),
  });

  res.status(200).json({
    message: "Success get roles",
    data: roles,
  });
}
