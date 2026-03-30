import Link from "next/link";

import { registerUserAction } from "@/features/auth/server/authActions";
import type { UserRole } from "@/features/auth/server/authTypes";

import styles from "./auth.module.css";

type ModernRegisterFormProps = {
  role: UserRole;
};

export function ModernRegisterForm(props: ModernRegisterFormProps) {
  const isOwner = props.role === "owner";
  const title = isOwner ? "Регистрация владельца" : "Регистрация гостя";
  const text = isOwner ? "Соберите базовые данные, чтобы открыть публичный вход для своей площадки." : "Создайте аккаунт, чтобы искать свободные слоты и быстро переходить к бронированию.";

  return (
    <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <form action={registerUserAction} className={styles.form}>
        <input name="role" type="hidden" value={props.role} />
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>Имя и фамилия</span>
            <input autoComplete="name" className={styles.input} name="fullName" placeholder="Анна Иванова" required />
          </label>
          <label className={styles.field}>
            <span>Email</span>
            <input autoComplete="email" className={styles.input} name="email" placeholder="name@example.com" required type="email" />
          </label>
          <label className={styles.field}>
            <span>Телефон</span>
            <input autoComplete="tel" className={styles.input} name="phone" placeholder="+375291112233" required />
          </label>
          {isOwner ? renderProviderField() : null}
          <label className={styles.field}>
            <span>Пароль</span>
            <input autoComplete="new-password" className={styles.input} name="password" placeholder="Минимум 8 символов" required type="password" />
          </label>
        </div>
        <button className={styles.primaryButton} type="submit">Создать аккаунт</button>
      </form>
      <p className={styles.footer}>Уже зарегистрированы? <Link className={styles.link} href="/login">Войти в кабинет</Link>.</p>
    </section>
  );
}

function renderProviderField() {
  return (
    <label className={styles.field}>
      <span>Название площадки или бренда</span>
      <input className={styles.input} name="providerTitle" placeholder="North Hall, Loft 17" />
    </label>
  );
}
