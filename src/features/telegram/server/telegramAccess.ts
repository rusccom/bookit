import { findUserById } from "@/features/auth/server/authRepository";

export async function isTelegramUserActive(userId: string) {
  const user = await findUserById(userId);
  return Boolean(user && !user.isBlocked);
}
