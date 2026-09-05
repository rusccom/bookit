import type { ZodType } from "zod";

export function parseWithMessage<T>(schema: ZodType<T>, input: unknown, fallback: string): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || fallback);
  return result.data;
}
