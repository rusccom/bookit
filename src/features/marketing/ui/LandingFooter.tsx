import styles from "./landingFooter.module.css";

const CREATOR_URL = "https://x.com/rusccom";

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyBlock}>
        <p className={styles.lead}>
          BookCort объединяет гостей и владельцев площадок в одном месте.
        </p>
        <p className={styles.meta}>© 2026 BookCort. Все права защищены.</p>
      </div>
      <a
        className={styles.credit}
        href={CREATOR_URL}
        rel="noreferrer"
        target="_blank"
      >
        made by rusccom
      </a>
    </footer>
  );
}
