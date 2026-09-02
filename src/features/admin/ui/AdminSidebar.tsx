import { logoutAdminAction } from "@/features/admin/server/adminActions";
import { AdminNavigation } from "./AdminNavigation";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";
import styles from "./adminPanel.module.css";

export function AdminSidebar({ login }: { login: string }) {
  return <aside className={styles.sidebar}>
    <div className={styles.sidebarBrand}>
      <span className={styles.brandMark}>B</span>
      <div><strong>BookCort</strong><span>Администрирование</span></div>
    </div>
    <AdminNavigation />
    <div className={styles.sidebarFooter}>
      <span>Вы вошли как</span><strong>{login}</strong>
      <form action={logoutAdminAction}><AdminSubmitButton className={styles.logoutButton} variant="secondary">Выйти</AdminSubmitButton></form>
    </div>
  </aside>;
}
