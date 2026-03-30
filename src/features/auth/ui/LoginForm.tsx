import Link from "next/link";

import { loginUserAction } from "@/features/auth/server/authActions";

export function LoginForm() {
  return (
    <form action={loginUserAction} className="panel auth-card form-grid">
      <header className="form-header">
        <h2>Войти в кабинет</h2>
        <p className="muted">Используйте email и пароль, которые указывали при регистрации.</p>
      </header>
      <label>
        <span>Email</span>
        <input autoComplete="email" name="email" placeholder="name@example.com" required type="email" />
      </label>
      <label>
        <span>Пароль</span>
        <input autoComplete="current-password" name="password" placeholder="Ваш пароль" required type="password" />
      </label>
      <button className="primary-button" type="submit">Войти</button>
      <p className="form-hint">Нужен новый аккаунт? <Link href="/register">Выберите сценарий регистрации</Link>.</p>
    </form>
  );
}
