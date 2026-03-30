import Link from "next/link";
import { registerUserAction } from "@/features/auth/server/authActions";
import type { UserRole } from "@/features/auth/server/authTypes";
import styles from "./auth.module.css";

type ModernRegisterFormProps = {
  role: UserRole;
};

export function ModernRegisterForm({ role }: ModernRegisterFormProps) {
  const isOwner = role === "owner";

  return (
    <form action={registerUserAction} className={styles.formGroup} style={{ gap: '20px' }}>
      <input name="role" type="hidden" value={role} />
      
      <div className={styles.formGroup}>
        <label htmlFor="fullName">Как к вам обращаться</label>
        <input 
          id="fullName"
          autoComplete="name" 
          name="fullName" 
          placeholder="Анна Иванова" 
          required 
          className={styles.input}
        />
      </div>
      
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
        <label htmlFor="phone">Телефон</label>
        <input 
          id="phone"
          autoComplete="tel" 
          name="phone" 
          placeholder="+375291112233" 
          required 
          className={styles.input}
        />
      </div>
      
      {isOwner ? (
        <div className={styles.formGroup}>
          <label htmlFor="providerTitle">Название пространства или бренда</label>
          <input 
            id="providerTitle"
            name="providerTitle" 
            placeholder="Лофт 17, North Hall" 
            className={styles.input}
          />
        </div>
      ) : null}
      
      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input 
          id="password"
          autoComplete="new-password" 
          name="password" 
          placeholder="Минимум 8 символов" 
          required 
          type="password" 
          className={styles.input}
        />
      </div>
      
      <button className={styles.primaryButton} type="submit">Создать аккаунт →</button>
      
      <div className={styles.footer}>
        Уже зарегистрированы? <Link href="/login" className={styles.link}>Войти</Link>
      </div>
    </form>
  );
}
