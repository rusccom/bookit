import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { formatBelarusPhone } from "@/features/shared/server/phone";
import { formatAdminDate, getAdminRoleLabel } from "./adminPresentation";
import { AdminUserActions } from "./AdminUserActions";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

type AdminUsersTableProps = { search: string; users: AdminUserRecord[] };

export function AdminUsersTable({ search, users }: AdminUsersTableProps) {
  const columns: AdminColumn<AdminUserRecord>[] = [
    { key: "user", label: "Пользователь", render: (user) => <AdminCell detail={user.id}><strong>{user.fullName}</strong></AdminCell> },
    { key: "contacts", label: "Контакты", render: (user) => <AdminCell detail={formatBelarusPhone(user.phone) || "Телефон не указан"}>{user.email || "—"}</AdminCell> },
    { key: "role", label: "Роль", render: (user) => <AdminBadge tone="info">{getAdminRoleLabel(user.role)}</AdminBadge> },
    { key: "status", label: "Статус", render: (user) => <AdminBadge tone={user.isBlocked ? "danger" : "success"}>{user.isBlocked ? "Заблокирован" : "Активен"}</AdminBadge> },
    { key: "created", label: "Регистрация", render: (user) => formatAdminDate(user.createdAt) },
    { key: "actions", label: "Управление", render: (user) => <AdminUserActions user={user} search={search} /> }
  ];
  return <AdminTable caption="Пользователи" columns={columns} items={users} rowKey={(user) => user.id} emptyMessage="Пользователи не найдены." />;
}
