import { createHash, randomInt } from "node:crypto";

import { getEnv } from "@/features/shared/server/env";

export function generateOtpCode(): string {
  return randomInt(100000, 999999).toString();
}

export function hashOtpCode(code: string): string {
  return createHash("sha256")
    .update(`${code}:${getEnv().SESSION_SECRET}`)
    .digest("hex");
}

export function verifyOtpCode(input: {
  code: string;
  hash: string;
}): boolean {
  return hashOtpCode(input.code) === input.hash;
}
