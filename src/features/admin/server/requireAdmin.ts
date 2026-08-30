import { redirect } from "next/navigation";

import { findAdminById } from "@/features/admin/server/adminRepository";
import { readAdminSession } from "@/features/admin/server/adminSession";

export async function getCurrentAdmin() {
  const session = await readAdminSession();
  if (!session) return null;
  return findAdminById(session.adminId);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
  return admin;
}
