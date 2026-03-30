import Link from "next/link";
import styles from "./landing.module.css";

export function ModernCta() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaBox}>
        <h2>Готовы начать?</h2>
        <p>Присоединяйтесь к тысячам пользователей, которые уже доверили нам свои бронирования и площадки.</p>
        <div className={styles.heroActions}>
          <Link href="/register" className={styles.primaryBtn}>
            Создать аккаунт бесплатно
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            Войти в кабинет
          </Link>
        </div>
      </div>
    </section>
  );
}
