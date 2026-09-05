import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { getEnv } from "@/features/shared/server/env";

export async function createSignedToken(payload: JWTPayload, expiration: string) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiration).setIssuedAt().sign(getTokenSecret());
}

export async function verifySignedToken<T extends JWTPayload>(token: string) {
  return (await jwtVerify<T>(token, getTokenSecret())).payload;
}

export function getPrivateCookieOptions(maxAge?: number) {
  const common = { httpOnly: true, path: "/", sameSite: "lax" as const,
    secure: getEnv().APP_URL.startsWith("https://") };
  return maxAge === undefined ? common : { ...common, maxAge };
}

function getTokenSecret() {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}
