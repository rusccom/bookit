import postgres from "postgres";

import { getEnv } from "@/features/shared/server/env";

type GlobalSql = {
  sql?: ReturnType<typeof postgres>;
};

const globalSql = globalThis as GlobalSql;

export function getDb() {
  if (globalSql.sql) {
    return globalSql.sql;
  }

  const env = getEnv();
  const ssl = isLocalDatabase(env.DATABASE_URL) ? false : "require";

  globalSql.sql = postgres(env.DATABASE_URL, {
    connect_timeout: 30,
    idle_timeout: 20,
    max: 1,
    prepare: false,
    ssl
  });

  return globalSql.sql;
}

function isLocalDatabase(databaseUrl: string) {
  const hostname = new URL(databaseUrl).hostname;
  return ["localhost", "127.0.0.1", "::1"].includes(hostname);
}
