import type { ManagedAdmin } from "@/features/admin/server/adminTypes";
import { DeleteAdminButton } from "@/features/admin/ui/DeleteAdminButton";

import styles from "./adminSecurity.module.css";

type AdminAccountsTableProps = { admins: ManagedAdmin[]; currentAdminId: string };

export function AdminAccountsTable(props: AdminAccountsTableProps) {
  return <section className={styles.card}><h2>Администраторы</h2><div className={styles.tableFrame}><table><thead><tr><th>Логин</th><th>Создан</th><th>2FA</th><th>Статус</th><th /></tr></thead><tbody>{props.admins.map((admin) => <tr key={admin.id}><td><strong>{admin.login}</strong>{admin.id === props.currentAdminId && <span>Текущий аккаунт</span>}</td><td>{formatDate(admin.createdAt)}</td><td>{admin.twoFactorEnabled ? "Включена" : "Выключена"}</td><td>{admin.isLocked ? "Временно заблокирован" : "Активен"}</td><td>{admin.id !== props.currentAdminId && <DeleteAdminButton adminId={admin.id} />}</td></tr>)}</tbody></table></div></section>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "medium" }).format(new Date(value));
}
