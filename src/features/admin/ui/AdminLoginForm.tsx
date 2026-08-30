import { loginAdminAction } from "@/features/admin/server/adminActions";

import styles from "./adminLogin.module.css";

type AdminLoginFormProps = {
  error?: string;
};

export function AdminLoginForm(props: AdminLoginFormProps) { return (
    <section className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <span className={styles.adminMark}>A</span>
        <p className={styles.eyebrow}>Закрытая зона</p>
        <h1>Вход администратора</h1>
        <p>Введите административные учётные данные для продолжения.</p>
      </div>
      {props.error && <p className={styles.loginError}>{props.error}</p>}
      <form action={loginAdminAction} className={styles.loginForm}>
        <label className={styles.field}><span>Логин</span><input autoComplete="username" name="login" required /></label>
        <label className={styles.field}><span>Пароль</span><input autoComplete="current-password" name="password" required type="password" /></label>
        <label className={styles.remember}>
          <input name="remember" type="checkbox" /><span>Запомнить мой вход на 30 дней</span>
        </label>
        <button className={styles.loginButton} type="submit">Войти</button>
      </form>
    </section>
  );
}
