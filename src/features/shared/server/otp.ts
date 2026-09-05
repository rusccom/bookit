import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { getEnv } from "@/features/shared/server/env";

export function generateOtpCode() {
  return randomInt(100000, 1000000).toString();
}

export function hashOtpCode(code: string) {
  return createHash("sha256").update(`${code}:${getEnv().SESSION_SECRET}`).digest("hex");
}

export function verifyOtpCode(input: { code: string; hash: string }) {
  const expected = Buffer.from(input.hash, "hex");
  const actual = Buffer.from(hashOtpCode(input.code), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
