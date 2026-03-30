import Link from "next/link";
import { loginUserAction } from "@/features/auth/server/authActions";
import styles from "./auth.module.css";

export function ModernLoginForm() {
  return (
    <form action={loginUserAction} className={styles.formGroup} style={{ gap: '20px' }}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          autoComplete="email" 
          name="email" 
          placeholder="name@example.com" 
          required 
          type="email" 
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input 
          id="password"
          autoComplete="current-password" 
          name="password" 
          placeholder="Ваш пароль" 
          required 
          type="password" 
          className={styles.input}
        />
      </div>
      <button className={styles.primaryButton} type="submit">Войти →</button>
      <div className={styles.footer}>
        Нет аккаунта? <Link href="/register" className={styles.link}>Создайте новый</Link>
      </div>
    </form>
  );
}
