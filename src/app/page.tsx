import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/features/marketing/ui/landing.module.css";

import { ModernHero } from "@/features/marketing/ui/ModernHero";
import { ModernFeatures } from "@/features/marketing/ui/ModernFeatures";
import { ModernCta } from "@/features/marketing/ui/ModernCta";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

export const metadata: Metadata = {
  title: "Bookit — Бронирование и управление пространствами",
  description:
    "Платформа №1 для удобной аренды залов, кортов, студий и управления вашим расписанием."
};

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className={styles.landingPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>B</div>
            Bookit
          </Link>
          <nav className={styles.nav}>
            <Link href="#features" className={styles.navLink}>Почему мы</Link>
            {user ? (
              <Link href={getDashboardPath(user.role)} className={styles.navBtn}>Кабинет</Link>
            ) : (
              <Link href="/login" className={styles.navBtn}>Войти</Link>
            )}
          </nav>
        </header>

        <ModernHero />
        <ModernFeatures />
        <ModernCta />
      </div>
    </main>
  );
}
