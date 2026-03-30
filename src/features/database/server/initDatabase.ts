import { getDb } from "@/features/database/server/client";
import { schemaSql } from "@/features/database/server/schema";

let initPromise: Promise<void> | null = null;

export async function initDatabase() {
  if (!initPromise) {
    initPromise = getDb()
      .unsafe(schemaSql)
      .then(() => undefined);
  }

  await initPromise;
}
