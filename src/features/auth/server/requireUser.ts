import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import type { UserRole } from "@/features/auth/server/authTypes";

export async function requireUser(role?: UserRole) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (role && user.role !== role) {
    redirect(getDashboardPath(user.role));
  }

  return user;
}

export function getDashboardPath(role: UserRole): string {
  return role === "owner" ? "/dashboard/owner" : "/dashboard/customer";
}
