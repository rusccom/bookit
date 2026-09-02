import { revokeAdminSessionAction } from "@/features/admin/server/adminSecurityActions";
import type { AdminSessionRecord } from "@/features/admin/server/adminTypes";
import { formatAdminDate } from "./adminPresentation";
import { AdminActionForm } from "./shared/AdminActionForm";
import { AdminCard } from "./shared/AdminCard";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

const columns: AdminColumn<AdminSessionRecord>[] = [
  { key: "device", label: "Устройство", render: (session) => <AdminCell detail={session.userAgent}><strong>{session.isCurrent ? "Текущая сессия" : "Другое устройство"}</strong></AdminCell> },
  { key: "seen", label: "Активность", render: (session) => formatAdminDate(session.lastSeenAt, true) },
  { key: "expires", label: "Действует до", render: (session) => formatAdminDate(session.expiresAt, true) },
  { key: "actions", label: "Управление", render: (session) => !session.isCurrent && <AdminActionForm action={revokeAdminSessionAction} values={{ sessionId: session.id }} variant="danger">Завершить</AdminActionForm> }
];

export function AdminSessionsTable({ sessions }: { sessions: AdminSessionRecord[] }) {
  return <AdminCard title="Активные сессии" description="Завершите вход на устройствах, которыми больше не пользуетесь.">
    <AdminTable caption="Активные сессии" columns={columns} items={sessions} rowKey={(session) => session.id} emptyMessage="Активных сессий нет." />
  </AdminCard>;
}
