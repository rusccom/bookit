import type { Sql } from "postgres";

export type DbExecutor = Pick<Sql<Record<string, never>>, "json" | "unsafe">;
