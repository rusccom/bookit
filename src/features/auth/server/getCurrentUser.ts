import { findUserById } from "@/features/auth/server/authRepository";
import { readSession } from "@/features/auth/server/session";

export async function getCurrentUser() {
  const session = await readSession();

  if (!session) {
    return null;
  }

  return findUserById(session.userId);
}
