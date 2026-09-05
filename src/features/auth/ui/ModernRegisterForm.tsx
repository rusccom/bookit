import Link from "next/link";

import { registerUserAction } from "@/features/auth/server/authActions";
import type { UserRole } from "@/features/auth/server/authTypes";
import { RegistrationFields } from "@/features/auth/ui/RegistrationFields";

import styles from "./auth.module.css";

type ModernRegisterFormProps = {
  role: UserRole;
};

export function ModernRegisterForm(props: ModernRegisterFormProps) {
  const isOwner = props.role === "owner";
  const title = isOwner ? "Регистрация арендодателя" : "Регистрация клиента";
  const text = isOwner ? "Укажите данные, чтобы начать сдавать корты в аренду." : "Создайте аккаунт, чтобы быстро находить и бронировать корты.";

  return <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2><p>{text}</p>
      </div>
      <form action={registerUserAction} className={styles.form}>
        <input name="role" type="hidden" value={props.role} />
        <RegistrationFields owner={isOwner} />
        <button className={styles.primaryButton} type="submit">Создать аккаунт</button>
      </form>
      <p className={styles.footer}>Уже зарегистрированы? <Link className={styles.link} href="/login">Войти в кабинет</Link>.</p>
    </section>;
}
