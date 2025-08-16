import { db } from "@/services";
import { Role } from "@/schemas";

export async function main() {
  await db
    .insert(Role)
    .values([
      {
        name: "Super Admin",
        identifier: "SUPER_ADMIN",
      },
      {
        name: "Owner",
        identifier: "OWNER",
      },
      {
        name: "Staff",
        identifier: "STAFF",
      },
    ])
    .onConflictDoNothing({ target: Role.identifier });

  console.log("01-role.ts seeded 🌱");
}
