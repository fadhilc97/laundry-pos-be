import { db } from "@/services";
import { SportCentreSchema } from "@/schemas";

async function run() {
  const sportCentre = await db.select().from(SportCentreSchema);
  if (sportCentre.length <= 0) {
    await db.insert(SportCentreSchema).values({
      name: "Sport Centre Demo",
      address: "Golden Prawn, Bengkong Laut",
    });
  }
}

run();
