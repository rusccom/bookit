import type { ManagedAdmin } from "@/features/admin/server/adminTypes";
import { formatAdminDate } from "./adminPresentation";
import { DeleteAdminButton } from "./DeleteAdminButton";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCard } from "./shared/AdminCard";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

type AdminAccountsTableProps = { admins: ManagedAdmin[]; currentAdminId: string };

export function AdminAccountsTable({ admins, currentAdminId }: AdminAccountsTableProps) {
  const columns: AdminColumn<ManagedAdmin>[] = [
    { key: "login", label: "Логин", render: (admin) => <AdminCell detail={admin.id === currentAdminId && "Текущий аккаунт"}><strong>{admin.login}</strong></AdminCell> },
    { key: "created", label: "Создан", render: (admin) => formatAdminDate(admin.createdAt) },
    { key: "2fa", label: "2FA", render: (admin) => <AdminBadge tone={admin.twoFactorEnabled ? "success" : "neutral"}>{admin.twoFactorEnabled ? "Включена" : "Выключена"}</AdminBadge> },
    { key: "status", label: "Статус", render: (admin) => <AdminBadge tone={admin.isLocked ? "danger" : "success"}>{admin.isLocked ? "Временно заблокирован" : "Активен"}</AdminBadge> },
    { key: "actions", label: "Управление", render: (admin) => admin.id !== currentAdminId && <DeleteAdminButton adminId={admin.id} /> }
  ];
  return <AdminCard title="Администраторы">
    <AdminTable caption="Администраторы" columns={columns} items={admins} rowKey={(admin) => admin.id} emptyMessage="Администраторы не найдены." />
  </AdminCard>;
}
