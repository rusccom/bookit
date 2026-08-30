import { getAdminUsers } from "@/features/admin/server/adminService";
import { AdminUsersTable } from "@/features/admin/ui/AdminUsersTable";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import styles from "@/features/admin/ui/adminPanel.module.css";
import dataStyles from "@/features/admin/ui/adminDataTable.module.css";

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage(props: AdminUsersPageProps) {
  const params = await props.searchParams;
  const search = pickValue(params.q) || "";
  const users = await getAdminUsers(search);
  return <section className={styles.usersPage}>
    <StatusBanner error={pickValue(params.error)} success={pickValue(params.success)} />
    <header className={styles.pageHeader}><div><p className={styles.eyebrow}>Управление платформой</p><h1>Пользователи</h1><p>Всего найдено: {users.length}</p></div></header>
    <form className={styles.searchForm} method="get"><input aria-label="Поиск пользователей" defaultValue={search} name="q" placeholder="Имя, email или телефон" type="search" /><button type="submit">Найти</button></form>
    <a className={dataStyles.exportLink} href="/adminpanel/export/users">Выгрузить пользователей в CSV</a>
    <AdminUsersTable search={search} users={users} />
  </section>;
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
