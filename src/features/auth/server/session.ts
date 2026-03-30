import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import type { AuthUser } from "@/features/auth/server/authTypes";
import { getEnv } from "@/features/shared/server/env";

const SESSION_COOKIE = "bookit_session";

type SessionPayload = {
  userId: string;
  role: AuthUser["role"];
};

export async function createSession(user: AuthUser) {
  const token = await signToken({
    role: user.role,
    userId: user.id
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, getCookieOptions());
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = getSessionSecret();
    const verified = await jwtVerify<SessionPayload>(token, secret);
    return verified.payload;
  } catch {
    return null;
  }
}

async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(getSessionSecret());
}

function getSessionSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}

function getCookieOptions() {
  const isSecure = getEnv().APP_URL.startsWith("https://");
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax" as const,
    secure: isSecure
  };
}
