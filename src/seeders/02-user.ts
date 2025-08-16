import { hash } from "bcrypt";
import { User } from "@/schemas";
import { db } from "@/services";

export async function main() {
  const encryptedPassword = await hash(
    process.env.INITIAL_SUPER_ADMIN_PASSWORD as string,
    10
  );

  await db
    .insert(User)
    .values({
      name: "Super Admin",
      email: process.env.INITIAL_SUPER_ADMIN_EMAIL as string,
      password: encryptedPassword,
    })
    .onConflictDoNothing({ target: User.email });

  console.log("02-user.ts seeded 🌱");
}
