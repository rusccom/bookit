import Link from "next/link";

import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

import styles from "./publicHeader.module.css";

const NAV_LINKS = [
  { href: "/#audiences", label: "Сценарии" },
  { href: "/#features", label: "Платформа" },
  { href: "/#how-it-works", label: "Как это работает" }
];

export async function ModernSiteHeader() {
  const user = await getCurrentUser();
  const ctaHref = user ? getDashboardPath(user.role) : "/register";
  const ctaLabel = user ? "Открыть кабинет" : "Создать аккаунт";

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        <span className={styles.mark}>B</span>
        <span className={styles.brandCopy}>
          <strong>Bookit</strong>
          <span>Бронирование пространств</span>
        </span>
      </Link>
      <nav className={styles.nav}>
        {NAV_LINKS.map(renderLink)}
        {user ? null : <Link className={styles.secondary} href="/login">Войти</Link>}
        <Link className={styles.primary} href={ctaHref}>{ctaLabel}</Link>
      </nav>
    </header>
  );
}

function renderLink(link: { href: string; label: string }) {
  return <Link key={link.href} className={styles.link} href={link.href}>{link.label}</Link>;
}
