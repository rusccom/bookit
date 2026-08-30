import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { getEnv } from "@/features/shared/server/env";

const ADMIN_COOKIE = "bookit_admin_session";
const REMEMBER_SECONDS = 60 * 60 * 24 * 30;

type AdminSession = {
  adminId: string;
};

export async function createAdminSession(
  admin: AdminAccount,
  remember: boolean
) {
  const token = await signToken(admin.id, remember);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, getCookieOptions(remember));
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const result = await jwtVerify<AdminSession>(token, getSecret());
    return result.payload;
  } catch {
    return null;
  }
}

async function signToken(adminId: string, remember: boolean) {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(remember ? "30d" : "12h")
    .setIssuedAt()
    .sign(getSecret());
}

function getCookieOptions(remember: boolean) {
  const options = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: getEnv().APP_URL.startsWith("https://")
  };
  return remember ? { ...options, maxAge: REMEMBER_SECONDS } : options;
}

function getSecret() {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}
