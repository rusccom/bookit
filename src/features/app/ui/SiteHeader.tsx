import Link from "next/link";

import { logoutUserAction } from "@/features/auth/server/authActions";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

import { MobileNav } from "./MobileNav";
import styles from "./dashboardHeader.module.css";

const CUSTOMER_NAV = [
  { href: "/dashboard/customer", label: "Главная" },
  { href: "/dashboard/customer/search", label: "Поиск корта" },
  { href: "/dashboard/customer/bookings", label: "Мои брони" },
];

const OWNER_NAV = [
  { href: "/dashboard/owner", label: "Обзор" },
  { href: "/dashboard/owner/units", label: "Объекты" },
  { href: "/dashboard/owner/bookings", label: "Бронирования" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const dashboardPath = user ? getDashboardPath(user.role) : "/";
  const navItems = user?.role === "owner" ? OWNER_NAV : CUSTOMER_NAV;
  const greeting = user ? `Привет, ${getFirstName(user.fullName)}` : null;

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <Link aria-label="BookCort" className={styles.logo} href={dashboardPath}>
          <span className={styles.logoMark}>B</span>
        </Link>
        {greeting && (
          <div className={styles.greeting}>
            <p className={styles.greetingEyebrow}>
              {user?.role === "owner" ? "Панель владельца" : "Личный кабинет"}
            </p>
            <p className={styles.greetingText}>{greeting}</p>
          </div>
        )}
      </div>
      {user ? (
        <>
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link key={item.href} className={styles.navLink} href={item.href}>
                {item.label}
              </Link>
            ))}
            <form action={logoutUserAction}>
              <button className="ghost-button" type="submit">Выйти</button>
            </form>
          </nav>
          <div className={styles.mobileNav}>
            <MobileNav items={navItems} logoutAction={logoutUserAction} />
          </div>
        </>
      ) : (
        <nav className={styles.desktopNav}>
          <Link className={styles.navLink} href="/login">Войти</Link>
          <Link className="primary-link" href="/register">Открыть аккаунт</Link>
        </nav>
      )}
    </header>
  );
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "друг";
}
