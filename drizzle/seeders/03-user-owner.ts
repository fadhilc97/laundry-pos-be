import bcrypt from "bcrypt";
import { db } from "@/services";
import {
  SportCentreSchema,
  UserSchema,
  RoleSchema,
  UserRoleSchema,
} from "@/schemas";
import { eq } from "drizzle-orm";
import { Role } from "@/utils";

async function run() {
  const [role] = await db
    .select({ id: RoleSchema.id })
    .from(RoleSchema)
    .where(eq(RoleSchema.identifier, Role.OWNER));
  const [centre] = await db
    .select({ id: SportCentreSchema.id })
    .from(SportCentreSchema)
    .limit(1);

  if (centre) {
    const [createdUser] = await db
      .insert(UserSchema)
      .values({
        name: "Owner Demo",
        email: "owner.demo@example.com",
        password: await bcrypt.hash(
          process.env.OWNER_INITIAL_PASSWORD ?? "owner_password",
          10
        ),
        centreId: centre.id,
      })
      .onConflictDoNothing({ target: UserSchema.email })
      .returning({ id: UserSchema.id });

    if (createdUser) {
      await db
        .insert(UserRoleSchema)
        .values({ userId: createdUser.id, roleId: role.id });
    }
  }
}

run();
