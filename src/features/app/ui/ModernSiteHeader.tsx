import Link from "next/link";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";
import styles from "@/features/marketing/ui/landing.module.css";

export async function ModernSiteHeader() {
  const user = await getCurrentUser();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>B</div>
          Bookit
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Главная</Link>
          <Link href="/#features" className={styles.navLink}>Возможности</Link>
          <Link href="/#features" className={styles.navLink}>Примеры</Link>
          {user ? (
            <Link href={getDashboardPath(user.role)} className={styles.navBtn}>Кабинет</Link>
          ) : (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <Link href="/login" className={styles.navLink}>Войти</Link>
              <Link href="/register" className={styles.navBtn}>Открыть аккаунт</Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
}
