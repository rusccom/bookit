import Link from "next/link";
import styles from "./landing.module.css";

export function ModernHero() {
  return (
    <section className={styles.hero}>
      <span className={styles.badge}>Bookit 2.0 Обновление</span>
      <h1 className={styles.title}>Бронируйте пространства в один клик</h1>
      <p className={styles.subtitle}>
        Единая платформа для тех, кто ищет идеальное место, и тех, кто хочет легко управлять арендой. Быстро, просто и красиво.
      </p>
      <div className={styles.heroActions}>
        <Link href="/register/guest" className={styles.primaryBtn}>
          Найти пространство <span aria-hidden="true">→</span>
        </Link>
        <Link href="/register/host" className={styles.secondaryBtn}>
          Добавить площадку
        </Link>
      </div>
    </section>
  );
}
