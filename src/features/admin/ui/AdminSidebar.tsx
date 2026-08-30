import { logoutAdminAction } from "@/features/admin/server/adminActions";
import { AdminNavigation } from "@/features/admin/ui/AdminNavigation";

import styles from "./adminPanel.module.css";

type AdminSidebarProps = {
  login: string;
};

export function AdminSidebar(props: AdminSidebarProps) { return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <span className={styles.brandMark}>B</span>
        <div><strong>BookCort</strong><span>Администрирование</span></div>
      </div>
      <AdminNavigation />
      <div className={styles.sidebarFooter}>
        <span>Вы вошли как</span><strong>{props.login}</strong>
        <form action={logoutAdminAction}>
          <button className={styles.logoutButton} type="submit">Выйти</button>
        </form>
      </div>
    </aside>
  );
}
