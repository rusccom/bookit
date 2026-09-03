import type { AdminAuditRecord } from "@/features/admin/server/adminTypes";
import { formatAdminDate, getAdminBookingStatus } from "./adminPresentation";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

export function AdminAuditTable({ records }: { records: AdminAuditRecord[] }) {
  const columns: AdminColumn<AdminAuditRecord>[] = [
    { key: "date", label: "Дата", render: (item) => formatAdminDate(item.createdAt, true) },
    { key: "admin", label: "Администратор", render: (item) => <strong>{item.adminLogin}</strong> },
    { key: "action", label: "Действие", render: (item) => translateAction(item.action) },
    { key: "entity", label: "Сущность", render: (item) => <AdminCell detail={item.entityId}>{translateEntity(item.entityType)}</AdminCell> },
    { key: "details", label: "Детали", render: (item) => formatDetails(item.details) }
  ];
  return <AdminTable caption="Журнал действий" columns={columns} items={records} rowKey={(item) => item.id} emptyMessage="Записи журнала не найдены." />;
}

function translateAction(action: string) {
  if (action === "note:add") return "Добавление заметки";
  const labels: Record<string, string> = { block: "Блокировка", create: "Создание", delete: "Удаление", disable: "Отключение", enable: "Включение", export: "Экспорт CSV", password: "Смена пароля", revoke: "Завершение сессии", unblock: "Разблокировка", update: "Изменение", "2fa:disable": "Отключение 2FA", "2fa:enable": "Включение 2FA", "2fa:setup": "Настройка 2FA" };
  if (action.startsWith("status:")) return "Статус: " + getAdminBookingStatus(action.slice(7)).label;
  return labels[action] || action;
}

function translateEntity(entity: string) {
  const labels: Record<string, string> = { admin: "Администратор", booking: "Бронирование", catalog: "Каталог", session: "Сессия", unit: "Корт", user: "Пользователь", venue: "Объект" };
  return labels[entity] || entity;
}

function formatDetails(details: AdminAuditRecord["details"]) {
  return Object.entries(details).map(([key, value]) => key + ": " + String(value)).join(", ") || "—";
}
