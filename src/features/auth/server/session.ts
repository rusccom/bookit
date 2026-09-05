import type { AuthUser } from "@/features/auth/server/authTypes";
import { deletePrivateCookie, readSignedCookie, saveSignedCookie } from "@/features/shared/server/signedCookie";

const SESSION_COOKIE = "bookit_session";

type SessionPayload = {
  userId: string;
  role: AuthUser["role"];
};

export async function createSession(user: AuthUser) {
  await saveSignedCookie(SESSION_COOKIE, { role: user.role, userId: user.id }, "7d", 60 * 60 * 24 * 7);
}
export async function clearSession() {
  await deletePrivateCookie(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  return readSignedCookie<SessionPayload>(SESSION_COOKIE);
}
