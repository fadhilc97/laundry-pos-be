import { Role, User, UserRole } from "@/schemas";
import { db } from "@/services";
import { eq } from "drizzle-orm";

export async function main() {
  const superAdminRole = await db.query.Role.findFirst({
    where: eq(Role.identifier, "SUPER_ADMIN"),
  });

  const superAdminUser = await db.query.User.findFirst({
    where: eq(User.email, process.env.INITIAL_SUPER_ADMIN_EMAIL as string),
  });

  if (!superAdminRole) {
    return console.error("ERROR: Super Admin role not exist");
  }

  if (!superAdminUser) {
    return console.error("ERROR: Super Admin user not exist");
  }

  await db.insert(UserRole).values({
    roleId: superAdminRole.id,
    userId: superAdminUser.id,
  });

  console.log("03-user-role.ts seeded 🌱");
}
