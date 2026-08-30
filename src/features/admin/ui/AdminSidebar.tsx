import Link from "next/link";

import { logoutAdminAction } from "@/features/admin/server/adminActions";

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
      <nav className={styles.sidebarNav} aria-label="Панель администратора">
        <Link className={styles.activeNavItem} href="/adminpanel">
          <span className={styles.navIcon}>П</span>Пользователи
        </Link>
      </nav>
      <div className={styles.sidebarFooter}>
        <span>Вы вошли как</span><strong>{props.login}</strong>
        <form action={logoutAdminAction}>
          <button className={styles.logoutButton} type="submit">Выйти</button>
        </form>
      </div>
    </aside>
  );
}
