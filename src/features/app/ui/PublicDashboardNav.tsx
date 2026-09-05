import Link from "next/link";
import styles from "./dashboardHeader.module.css";

export function PublicDashboardNav() {
  return <nav className={styles.desktopNav}>
    <Link className={styles.navLink} href="/login">Войти</Link>
    <Link className="primary-link" href="/register">Открыть аккаунт</Link>
  </nav>;
}
