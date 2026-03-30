import Link from "next/link";

import styles from "./landing.module.css";

const METRICS = [
  { label: "Минут до брони", value: "2" },
  { label: "Сценария для запуска", value: "2" },
  { label: "Окна в один клик", value: "24/7" }
];

const SLOTS = [
  { time: "09:30", title: "Padel Court A", state: "Подтверждено" },
  { time: "12:00", title: "Loft Hall", state: "Ожидает ответа" },
  { time: "18:45", title: "Studio Black", state: "Свободный слот" }
];

export function ModernHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Новый публичный интерфейс Bookit</p>
        <h1 className={styles.heroTitle}>Бронирование пространств, которое выглядит как готовый продукт, а не как набор форм.</h1>
        <p className={styles.heroText}>Гость быстро находит свободное окно. Владелец получает понятный поток броней и чистый маршрут от лендинга до личного кабинета.</p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/register">Запустить аккаунт</Link>
          <Link className={styles.secondaryButton} href="/login">Войти в кабинет</Link>
        </div>
        <div className={styles.metricGrid}>{METRICS.map(renderMetric)}</div>
      </div>
      <aside className={styles.heroPanel}>
        <div className={styles.panelBadge}>Сегодня в Bookit</div>
        <div className={styles.panelHeader}>
          <div>
            <strong>Живой календарь</strong>
            <span>Без ручных таблиц и переписок</span>
          </div>
          <div className={styles.fillRate}>86%</div>
        </div>
        <div className={styles.slotList}>{SLOTS.map(renderSlot)}</div>
        <div className={styles.panelFooter}>
          <div className={styles.miniCard}>
            <strong>02 мин</strong>
            <span>среднее время до ответа гостю</span>
          </div>
          <div className={styles.miniCard}>
            <strong>+14%</strong>
            <span>заполняемость после запуска витрины</span>
          </div>
        </div>
      </aside>
    </section>
  );
}

function renderMetric(metric: { label: string; value: string }) {
  return (
    <div key={metric.label} className={styles.metricCard}>
      <strong>{metric.value}</strong>
      <span>{metric.label}</span>
    </div>
  );
}

function renderSlot(slot: { time: string; title: string; state: string }) {
  return (
    <article key={`${slot.time}-${slot.title}`} className={styles.slotCard}>
      <span>{slot.time}</span>
      <div>
        <strong>{slot.title}</strong>
        <span>{slot.state}</span>
      </div>
    </article>
  );
}
