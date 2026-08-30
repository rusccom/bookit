import type { AdminAuditRecord } from "@/features/admin/server/adminTypes";

import styles from "./adminDataTable.module.css";

type AdminAuditTableProps = { records: AdminAuditRecord[] };

export function AdminAuditTable({ records }: AdminAuditTableProps) {
  if (!records.length) return <div className={styles.empty}>Записи журнала не найдены.</div>;
  return <div className={styles.tableFrame}><table><thead><tr><th>Дата</th><th>Администратор</th><th>Действие</th><th>Сущность</th><th>Детали</th></tr></thead><tbody>{records.map((item) => <tr key={item.id}><td>{formatDate(item.createdAt)}</td><td><strong>{item.adminLogin}</strong></td><td>{translateAction(item.action)}</td><td>{translateEntity(item.entityType)}<span>{item.entityId}</span></td><td>{formatDetails(item.details)}</td></tr>)}</tbody></table></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function translateAction(action: string) {
  const labels: Record<string, string> = { block: "Блокировка", create: "Создание", delete: "Удаление", disable: "Отключение", enable: "Включение", export: "Экспорт CSV", password: "Смена пароля", revoke: "Завершение сессии", unblock: "Разблокировка", update: "Изменение", "2fa:disable": "Отключение 2FA", "2fa:enable": "Включение 2FA", "2fa:setup": "Настройка 2FA" };
  if (action.startsWith("status:")) return `Статус: ${action.split(":")[1]}`;
  return labels[action] || action;
}

function translateEntity(entity: string) {
  const labels: Record<string, string> = { admin: "Администратор", booking: "Бронирование", catalog: "Каталог", session: "Сессия", unit: "Корт", user: "Пользователь", venue: "Объект" };
  return labels[entity] || entity;
}

function formatDetails(details: Record<string, string | number | boolean | null>) {
  const text = Object.entries(details).map(([key, value]) => `${key}: ${String(value)}`).join(", ");
  return text || "—";
}
