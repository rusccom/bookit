import type { PreparedRegistration } from "@/features/auth/server/authService";
import { deletePrivateCookie, readSignedCookie, saveSignedCookie } from "@/features/shared/server/signedCookie";

const COOKIE_NAME = "bookit_pending_registration";

export type PendingRegistration = PreparedRegistration & {
  codeHash: string;
};

export async function savePendingRegistration(payload: PendingRegistration) {
  await saveSignedCookie(COOKIE_NAME, payload, "10m", 60 * 10);
}
export async function readPendingRegistration() {
  return readSignedCookie<PendingRegistration>(COOKIE_NAME);
}

export async function clearPendingRegistration() {
  await deletePrivateCookie(COOKIE_NAME);
}
