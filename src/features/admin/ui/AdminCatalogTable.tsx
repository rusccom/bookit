import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { AdminCatalogActions } from "./AdminCatalogActions";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";
import { AdminLink } from "./shared/AdminLink";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";

type AdminCatalogTableProps = { city: string; items: AdminCatalogRecord[]; search: string; status: string };

export function AdminCatalogTable({ items, ...filters }: AdminCatalogTableProps) {
  const columns: AdminColumn<AdminCatalogRecord>[] = [
    { key: "venue", label: "Объект", render: (item) => <AdminCell detail={item.city + ", " + item.address}><strong>{item.venueTitle}</strong></AdminCell> },
    { key: "unit", label: "Корт", render: (item) => <AdminCell detail={`Шаг: ${formatSlotMinutes(item.slotMinutes)} · ${item.pricePerHour > 0 ? item.pricePerHour.toFixed(2) + " BYN/ч" : "Цена по запросу"}`}>{item.unitTitle}</AdminCell> },
    { key: "owner", label: "Владелец", render: (item) => <AdminLink href={`/adminpanel/users/${item.ownerId}`}>{item.ownerName}</AdminLink> },
    { key: "schedule", label: "Расписание", render: (item) => <AdminBadge tone={item.scheduledDays ? "info" : "warning"}>{item.scheduledDays ? `Рабочих дней: ${item.scheduledDays}` : "Нет слотов"}</AdminBadge> },
    { key: "status", label: "Статус", render: (item) => <AdminBadge tone={item.isVenueActive && item.isUnitActive ? "success" : "danger"}>{item.isVenueActive && item.isUnitActive ? "Активен" : "Отключён"}</AdminBadge> },
    { key: "actions", label: "Управление", render: (item) => <AdminCatalogActions item={item} {...filters} /> }
  ];
  return <AdminTable caption="Объекты и корты" columns={columns} items={items} rowKey={(item) => item.unitId} emptyMessage="Объекты и корты не найдены." />;
}
