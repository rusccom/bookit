import type { AdminUserDetails } from "@/features/admin/server/adminTypes";
import { formatBelarusPhone } from "@/features/shared/server/phone";
import { formatAdminDate, getAdminRoleLabel } from "./adminPresentation";
import { AdminUserActions } from "./AdminUserActions";
import { AdminUserBookingTable } from "./AdminUserBookingTable";
import { AdminUserCatalogList } from "./AdminUserCatalogList";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCard } from "./shared/AdminCard";
import { AdminLink } from "./shared/AdminLink";
import { AdminPage } from "./shared/AdminPage";
import { AdminStats } from "./shared/AdminStats";

export function AdminUserDetailsView({ details }: { details: AdminUserDetails }) {
  const { user } = details;
  const contacts = (user.email || "Email не указан") + " · " + (formatBelarusPhone(user.phone) || "Телефон не указан");
  return <AdminPage eyebrow={getAdminRoleLabel(user.role)} title={user.fullName} description={contacts}>
    <AdminLink href="/adminpanel/users">← Все пользователи</AdminLink>
    <AdminCard>
      <AdminBadge tone={user.isBlocked ? "danger" : "success"}>{user.isBlocked ? "Заблокирован" : "Активен"}</AdminBadge>
      <AdminUserActions user={user} search="" showDetails={false} />
    </AdminCard>
    <AdminStats items={[
      { label: "Регистрация", value: formatAdminDate(user.createdAt) },
      { label: "Бронирования", value: user.bookingsCount },
      { label: "Корты", value: user.unitsCount }
    ]} />
    <AdminCard title="История бронирований"><AdminUserBookingTable bookings={details.bookings} /></AdminCard>
    {user.role === "owner" && <AdminCard title="Объекты и корты"><AdminUserCatalogList catalog={details.catalog} /></AdminCard>}
  </AdminPage>;
}
