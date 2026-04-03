import Link from "next/link";

import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

import styles from "./publicHeader.module.css";

export async function ModernSiteHeader() {
  const user = await getCurrentUser();
  const ctaHref = user ? getDashboardPath(user.role) : "/register";
  const ctaLabel = user ? "Личный кабинет" : "Регистрация";

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        <span className={styles.mark}>B</span>
        <span className={styles.brandName}>BookCort</span>
      </Link>
      <nav className={styles.nav}>
        {user ? null : (
          <Link className={styles.secondary} href="/login">Войти</Link>
        )}
        <Link className={styles.primary} href={ctaHref}>{ctaLabel}</Link>
      </nav>
    </header>
  );
}
