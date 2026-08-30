import { revokeAdminSessionAction } from "@/features/admin/server/adminSecurityActions";
import type { AdminSessionRecord } from "@/features/admin/server/adminTypes";

import styles from "./adminSecurity.module.css";

type AdminSessionsTableProps = { sessions: AdminSessionRecord[] };

export function AdminSessionsTable({ sessions }: AdminSessionsTableProps) {
  return <section className={styles.card}><h2>Активные сессии</h2><p>Завершите вход на устройствах, которыми больше не пользуетесь.</p><div className={styles.sessionList}>{sessions.map((session) => <article key={session.id}><div><strong>{session.isCurrent ? "Текущая сессия" : "Другое устройство"}</strong><span>{session.userAgent}</span><small>Активность: {formatDate(session.lastSeenAt)} · до {formatDate(session.expiresAt)}</small></div>{!session.isCurrent && <form action={revokeAdminSessionAction}><input name="sessionId" type="hidden" value={session.id} /><button className={styles.dangerButton} type="submit">Завершить</button></form>}</article>)}</div></section>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}
