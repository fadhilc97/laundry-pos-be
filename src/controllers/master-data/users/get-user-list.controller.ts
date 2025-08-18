import { IAuthRequest } from "@/utils";
import { Response } from "express";
import { db } from "@/services";
import { eq, notInArray } from "drizzle-orm";
import { Role, User, UserRole } from "@/schemas";

export async function getUserlistController(req: IAuthRequest, res: Response) {
  const superAdminRole = await db.query.Role.findFirst({
    where: eq(Role.identifier, "SUPER_ADMIN"),
    columns: { id: true },
  });

  const users = await db
    .select({
      id: User.id,
      name: User.name,
      email: User.email,
      userRole: UserRole,
      role: Role,
    })
    .from(User)
    .innerJoin(UserRole, eq(User.id, UserRole.userId))
    .innerJoin(Role, eq(UserRole.roleId, Role.id));

  const result = users.reduce<
    Record<
      number,
      {
        id: number;
        name: string;
        email: string;
        roles: { id: number; name: string }[];
      }
    >
  >((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = { id: row.id, name: row.name, email: row.email, roles: [] };
    }

    if (row.userRole) {
      acc[row.id].roles.push({
        id: row.role.id,
        name: row.role.name,
      });
    }

    return acc;
  }, {});

  res.status(200).json({
    message: "Success get users",
    data: Object.values(result),
  });
}
