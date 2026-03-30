import type { UserRole } from "@/features/auth/server/authTypes";

export function getRegisterPath(role: UserRole | string) {
  return role === "owner" ? "/register/host" : "/register/guest";
}
