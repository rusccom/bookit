import { ZodError } from "zod";

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) return error.issues[0]?.message || fallback;
  return error instanceof Error ? error.message : fallback;
}

export function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null
    && "code" in error && error.code === "23505";
}
