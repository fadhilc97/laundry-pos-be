import { IAuthRequest } from "@/utils";
import { db } from "@/services";
import { Response } from "express";
import { Role, User, UserRole } from "@/schemas";
import { eq } from "drizzle-orm";

export async function getUserDetailController(
  req: IAuthRequest,
  res: Response
) {
  const params = req.params as { userId: string };

  const users = await db
    .select({
      id: User.id,
      email: User.email,
      userRole: UserRole,
      role: Role,
    })
    .from(User)
    .innerJoin(UserRole, eq(UserRole.userId, User.id))
    .innerJoin(Role, eq(UserRole.roleId, Role.id))
    .where(eq(User.id, +params.userId));

  const result = users.reduce<
    Record<
      number,
      {
        id: number;
        email: string;
        roles: { id: number; name: string }[];
      }
    >
  >((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = { id: row.id, email: row.email, roles: [] };
    }

    if (row.userRole) {
      acc[row.id].roles.push({
        id: row.role.id,
        name: row.role.name,
      });
    }

    return acc;
  }, {});

  const [user] = Object.values(result);

  res.status(200).json({
    message: "Success get detail data",
    data: user,
  });
}
