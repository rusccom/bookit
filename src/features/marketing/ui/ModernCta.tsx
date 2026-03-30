import Link from "next/link";

import styles from "./landing.module.css";

export function ModernCta() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        <div>
          <p className={styles.eyebrow}>Готово к запуску</p>
          <h2>Публичная зона Bookit теперь может жить отдельно от будущих дашбордов и не спорить с ними визуально.</h2>
        </div>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/register">Открыть регистрацию</Link>
          <Link className={styles.secondaryButton} href="/login">Перейти ко входу</Link>
        </div>
      </div>
    </section>
  );
}
