import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import {
  createAdminSessionRecord,
  findActiveAdminSession,
  revokeAdminSessionById,
  touchAdminSession
} from "@/features/admin/server/adminSessionRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { getEnv } from "@/features/shared/server/env";

const ADMIN_COOKIE = "bookit_admin_session";
const REMEMBER_SECONDS = 60 * 60 * 24 * 30;

type AdminSession = {
  adminId: string;
  sessionId: string;
};

export async function createAdminSession(
  admin: AdminAccount,
  remember: boolean
) {
  const duration = remember ? REMEMBER_SECONDS : 60 * 60 * 12;
  const expiresAt = new Date(Date.now() + duration * 1000);
  const requestHeaders = await headers();
  const sessionId = await createAdminSessionRecord({
    adminId: admin.id,
    expiresAt,
    userAgent: requestHeaders.get("user-agent") || "Неизвестное устройство"
  });
  const token = await signToken({ adminId: admin.id, sessionId }, duration);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, getCookieOptions(remember));
}

export async function clearAdminSession() {
  const session = await readAdminSession();
  if (session) await revokeAdminSessionById(session.sessionId);
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const result = await jwtVerify<AdminSession>(token, getSecret());
    const session = await findActiveAdminSession(result.payload.sessionId);
    if (!session || session.admin_user_id !== result.payload.adminId) return null;
    await touchAdminSession(session.id);
    return result.payload;
  } catch {
    return null;
  }
}

async function signToken(payload: AdminSession, duration: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${duration}s`)
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
