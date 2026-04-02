import { confirmRegistrationAction } from "@/features/auth/server/authActions";

import styles from "./auth.module.css";

export function RegisterVerificationForm() {
  return (
    <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2>Подтвердите номер</h2>
        <p>Введите код из SMS. Обычно приходит в течение нескольких секунд.</p>
      </div>
      <form action={confirmRegistrationAction} className={styles.form}>
        <label className={styles.field}>
          <span>Код из SMS</span>
          <input
            autoComplete="one-time-code"
            className={styles.input}
            inputMode="numeric"
            name="code"
            placeholder="123456"
            required
          />
        </label>
        <button className={styles.primaryButton} type="submit">
          Подтвердить регистрацию
        </button>
      </form>
    </section>
  );
}
