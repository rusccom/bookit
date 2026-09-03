import type { AdminUserDetails } from "@/features/admin/server/adminTypes";
import { formatBelarusPhone } from "@/features/shared/server/phone";
import { getAdminRoleLabel } from "./adminPresentation";
import { AdminUserActions } from "./AdminUserActions";
import { AdminUserBookingTable } from "./AdminUserBookingTable";
import { AdminUserCatalogList } from "./AdminUserCatalogList";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCard } from "./shared/AdminCard";
import { AdminLink } from "./shared/AdminLink";
import { AdminPage } from "./shared/AdminPage";
import { AdminUserStats } from "./AdminUserStats";
import { AdminUserNotes } from "./AdminUserNotes";

export function AdminUserDetailsView({ details, error, success }: { details: AdminUserDetails; error?: string; success?: string }) {
  const { user } = details;
  const contacts = (user.email || "Email не указан") + " · " + (formatBelarusPhone(user.phone) || "Телефон не указан");
  return <AdminPage eyebrow={getAdminRoleLabel(user.role)} title={user.fullName} description={contacts} error={error} success={success}>
    <AdminLink href="/adminpanel/users">← Все пользователи</AdminLink>
    <AdminCard>
      <AdminBadge tone={user.isBlocked ? "danger" : "success"}>{user.isBlocked ? "Заблокирован" : "Активен"}</AdminBadge>
      <AdminUserActions user={user} search="" showDetails={false} />
    </AdminCard>
    <AdminUserStats user={user} />
    {user.role === "customer" && <AdminCard title="Личная история бронирований"><AdminUserBookingTable bookings={details.bookings} /></AdminCard>}
    {user.role === "owner" && <AdminCard title="Объекты и корты"><AdminUserCatalogList catalog={details.catalog} /></AdminCard>}
    <AdminUserNotes notes={details.notes} userId={user.id} />
  </AdminPage>;
}
