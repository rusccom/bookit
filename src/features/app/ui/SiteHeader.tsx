import Link from "next/link";

import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { logoutUserAction } from "@/features/auth/server/authActions";
import { getDashboardPath } from "@/features/auth/server/requireUser";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        Bookit
      </Link>
      <nav className="site-nav">
        <Link href="/">Главная</Link>
        {user ? <Link href={getDashboardPath(user.role)}>Кабинет</Link> : null}
        {user ? (
          <form action={logoutUserAction}>
            <button className="ghost-button" type="submit">
              Выйти
            </button>
          </form>
        ) : (
          <>
            <Link href="/login">Войти</Link>
            <Link className="primary-link" href="/register?role=customer">
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
