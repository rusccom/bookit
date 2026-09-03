import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { formatAdminDate } from "./adminPresentation";
import { AdminStats } from "./shared/AdminStats";

export function AdminUserStats({ user }: { user: AdminUserRecord }) {
  const activity = user.role === "owner"
    ? { label: "Корты", value: user.unitsCount }
    : { label: "Личные бронирования", value: user.bookingsCount };
  return <AdminStats items={[{ label: "Регистрация", value: formatAdminDate(user.createdAt) }, activity]} />;
}
