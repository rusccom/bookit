import Link from "next/link";

import { loginUserAction } from "@/features/auth/server/authActions";

import styles from "./auth.module.css";

export function ModernLoginForm() {
  return (
    <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2>Вход в кабинет</h2>
        <p>Используйте email и пароль, которые указали при регистрации.</p>
      </div>
      <form action={loginUserAction} className={styles.form}>
        <label className={styles.field}>
          <span>Email</span>
          <input autoComplete="email" className={styles.input} name="email" placeholder="name@example.com" required type="email" />
        </label>
        <label className={styles.field}>
          <span>Пароль</span>
          <input autoComplete="current-password" className={styles.input} name="password" placeholder="Введите пароль" required type="password" />
        </label>
        <button className={styles.primaryButton} type="submit">Войти</button>
      </form>
      <p className={styles.footer}>Нет аккаунта? <Link className={styles.link} href="/register">Выберите сценарий регистрации</Link>.</p>
    </section>
  );
}
