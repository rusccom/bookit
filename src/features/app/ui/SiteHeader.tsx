import Link from "next/link";

import { logoutUserAction } from "@/features/auth/server/authActions";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">B</span>
        <span className="brand-copy">
          <strong>BookCort</strong>
          <span>Бронирование кортов</span>
        </span>
      </Link>
      <nav className="site-nav">
        <Link className="site-nav-link" href="/">Главная</Link>
        <Link className="site-nav-link" href="/#benefits">Возможности</Link>
        <Link className="site-nav-link" href="/#scenarios">Примеры</Link>
        {user ? (
          <Link className="site-nav-link" href={getDashboardPath(user.role)}>Кабинет</Link>
        ) : (
          <Link className="site-nav-link" href="/login">Войти</Link>
        )}
        {user ? (
          <form action={logoutUserAction}>
            <button className="ghost-button" type="submit">Выйти</button>
          </form>
        ) : (
          <Link className="primary-link" href="/register">Открыть аккаунт</Link>
        )}
      </nav>
    </header>
  );
}
