import { db } from "@/services";
import { RoleSchema } from "@/schemas";
import { Role } from "@/utils/types";

async function run() {
  await db
    .insert(RoleSchema)
    .values([
      { name: "Super Admin", identifier: Role.SUPER_ADMIN },
      {
        name: "Owner",
        identifier: Role.OWNER,
      },
      {
        name: "Cashier",
        identifier: Role.CASHIER,
      },
    ])
    .onConflictDoNothing({ target: [RoleSchema.identifier] });
}

run();
