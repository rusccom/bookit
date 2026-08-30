import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { DeleteUserButton } from "@/features/admin/ui/DeleteUserButton";

import styles from "./adminPanel.module.css";

type AdminUserRowProps = {
  search: string;
  user: AdminUserRecord;
};

export function AdminUserRow({ search, user }: AdminUserRowProps) {
  return (
    <tr>
      <td><strong>{user.fullName}</strong><span className={styles.userId}>{user.id}</span></td>
      <td>{user.email || "—"}<span className={styles.phone}>{user.phone || "Телефон не указан"}</span></td>
      <td><span className={styles.roleBadge}>{user.role === "owner" ? "Владелец" : "Клиент"}</span></td>
      <td>{formatDate(user.createdAt)}</td>
      <td><DeleteUserButton search={search} userId={user.id} /></td>
    </tr>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "medium" })
    .format(new Date(value));
}
