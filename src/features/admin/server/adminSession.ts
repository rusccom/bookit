import { headers } from "next/headers";

import {
  createAdminSessionRecord,
  findActiveAdminSession,
  revokeAdminSessionById,
  touchAdminSession
} from "@/features/admin/server/adminSessionRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { deletePrivateCookie, readSignedCookie, saveSignedCookie } from "@/features/shared/server/signedCookie";

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
  await saveSignedCookie(ADMIN_COOKIE, { adminId: admin.id, sessionId }, `${duration}s`, remember ? REMEMBER_SECONDS : undefined);
}

export async function clearAdminSession() {
  const session = await readAdminSession();
  if (session) await revokeAdminSessionById(session.sessionId);
  await deletePrivateCookie(ADMIN_COOKIE);
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const payload = await readSignedCookie<AdminSession>(ADMIN_COOKIE);
  if (!payload) return null;
  const session = await findActiveAdminSession(payload.sessionId);
  if (!session || session.admin_user_id !== payload.adminId) return null;
  await touchAdminSession(session.id);
  return payload;
}
