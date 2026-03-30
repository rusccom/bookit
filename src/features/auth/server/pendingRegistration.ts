import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import type { PreparedRegistration } from "@/features/auth/server/authService";
import { getEnv } from "@/features/shared/server/env";

const COOKIE_NAME = "bookit_pending_registration";

export type PendingRegistration = PreparedRegistration & {
  codeHash: string;
};

export async function savePendingRegistration(payload: PendingRegistration) {
  const store = await cookies();
  const token = await signPendingRegistration(payload);
  store.set(COOKIE_NAME, token, getCookieOptions());
}

export async function readPendingRegistration() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify<PendingRegistration>(token, getSecret());
    return verified.payload;
  } catch {
    return null;
  }
}

export async function clearPendingRegistration() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

async function signPendingRegistration(payload: PendingRegistration) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .setIssuedAt()
    .sign(getSecret());
}

function getSecret() {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}

function getCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax" as const,
    secure: getEnv().APP_URL.startsWith("https://")
  };
}
