import { initDatabase } from "@/features/database/server/initDatabase";

async function run() {
  await initDatabase();
  console.log("Database schema is ready.");
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
