import Link from "next/link";

import styles from "./landing.module.css";

const METRICS = [
  { label: "До первой брони", value: "2 мин" },
  { label: "Роли в системе", value: "2" },
  { label: "Доступность слотов", value: "24/7" }
];

const SLOTS = [
  { time: "09:30", title: "Padel Court A", state: "Подтверждено" },
  { time: "12:00", title: "Loft Hall", state: "Ожидает" },
  { time: "18:45", title: "Studio Black", state: "Свободно" }
];

export function ModernHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Платформа бронирования</p>
        <h1 className={styles.heroTitle}>
          Бронируйте пространства без звонков и переписок.
        </h1>
        <p className={styles.heroText}>
          Гости находят свободные слоты за секунды. Владельцы получают
          автоматизированный поток заявок и полный контроль расписания.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/register">
            Создать аккаунт
          </Link>
          <Link className={styles.secondaryButton} href="/login">
            Войти
          </Link>
        </div>
        <div className={styles.metricGrid}>
          {METRICS.map(renderMetric)}
        </div>
      </div>
      <aside className={styles.heroPanel}>
        <div className={styles.panelBadge}>Live</div>
        <div className={styles.panelHeader}>
          <div>
            <strong>Календарь бронирований</strong>
            <span>Обновляется в реальном времени</span>
          </div>
          <div className={styles.fillRate}>86%</div>
        </div>
        <div className={styles.slotList}>{SLOTS.map(renderSlot)}</div>
        <div className={styles.panelFooter}>
          <div className={styles.miniCard}>
            <strong>02 мин</strong>
            <span>среднее время ответа</span>
          </div>
          <div className={styles.miniCard}>
            <strong>+14%</strong>
            <span>рост заполняемости</span>
          </div>
        </div>
      </aside>
    </section>
  );
}

function renderMetric(m: { label: string; value: string }) {
  return (
    <div key={m.label} className={styles.metricCard}>
      <strong>{m.value}</strong>
      <span>{m.label}</span>
    </div>
  );
}

function renderSlot(s: { state: string; time: string; title: string }) {
  return (
    <article key={`${s.time}-${s.title}`} className={styles.slotCard}>
      <span>{s.time}</span>
      <div>
        <strong>{s.title}</strong>
        <span>{s.state}</span>
      </div>
    </article>
  );
}
