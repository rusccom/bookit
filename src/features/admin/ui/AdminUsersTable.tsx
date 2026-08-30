import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { AdminUserRow } from "@/features/admin/ui/AdminUserRow";

import styles from "./adminPanel.module.css";

type AdminUsersTableProps = {
  search: string;
  users: AdminUserRecord[];
};

export function AdminUsersTable(props: AdminUsersTableProps) {
  if (!props.users.length) {
    return <div className={styles.emptyState}>Пользователи не найдены.</div>;
  }
  return (
    <div className={styles.tableFrame}>
      <table className={styles.usersTable}>
        <thead><tr><th>Пользователь</th><th>Контакты</th><th>Роль</th><th>Регистрация</th><th>Управление</th></tr></thead>
        <tbody>{props.users.map((user) => (
          <AdminUserRow key={user.id} search={props.search} user={user} />
        ))}</tbody>
      </table>
    </div>
  );
}
