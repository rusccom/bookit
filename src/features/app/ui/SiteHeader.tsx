import Link from "next/link";

import { logoutUserAction } from "@/features/auth/server/authActions";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

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

  return (
    <header className="site-header">
      <Link className="brand" href={dashboardPath}>
        <span className="brand-mark">B</span>
        <span className="brand-copy">
          <strong>BookCort</strong>
          <span>Бронирование кортов</span>
        </span>
      </Link>
      <nav className="site-nav">
        {user ? (
          <>
            {navItems.map((item) => (
              <Link key={item.href} className="nav-link" href={item.href}>
                {item.label}
              </Link>
            ))}
            <form action={logoutUserAction}>
              <button className="ghost-button" type="submit">Выйти</button>
            </form>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/login">Войти</Link>
            <Link className="primary-link" href="/register">Открыть аккаунт</Link>
          </>
        )}
      </nav>
    </header>
  );
}
