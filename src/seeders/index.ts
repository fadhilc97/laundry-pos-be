import { main as seed01 } from "./01-role";
import { main as seed02 } from "./02-user";
import { main as seed03 } from "./03-user-role";

async function runSeeders() {
  await seed01();
  await seed02();
  await seed03();
}

runSeeders();
