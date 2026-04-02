import Link from "next/link";

import styles from "./landing.module.css";

export function ModernCta() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        <div>
          <p className={styles.eyebrow}>Готовы начать?</p>
          <h2>
            Запустите бронирование вашей площадки уже сегодня.
          </h2>
        </div>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/register">
            Создать аккаунт
          </Link>
          <Link className={styles.secondaryButton} href="/login">
            Войти
          </Link>
        </div>
      </div>
    </section>
  );
}
