import type { AdminUserCatalogItem } from "@/features/admin/server/adminTypes";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

const columns: AdminColumn<AdminUserCatalogItem>[] = [
  { key: "unit", label: "Корт", render: (item) => <strong>{item.unitTitle}</strong> },
  { key: "venue", label: "Объект", render: (item) => <AdminCell detail={item.city}>{item.venueTitle}</AdminCell> },
  { key: "status", label: "Статус", render: (item) => <AdminBadge tone={item.isActive ? "success" : "danger"}>{item.isActive ? "Активен" : "Отключён"}</AdminBadge> }
];

export function AdminUserCatalogList({ catalog }: { catalog: AdminUserCatalogItem[] }) {
  return <AdminTable caption="Корты пользователя" columns={columns} items={catalog} rowKey={(item) => item.unitId} emptyMessage="У пользователя нет кортов." />;
}
