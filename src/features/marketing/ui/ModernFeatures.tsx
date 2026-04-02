import styles from "./landing.module.css";

const FEATURES = [
  {
    title: "Календарь в реальном времени",
    text: "Актуальное расписание без ручных таблиц. Гости видят только свободные слоты."
  },
  {
    title: "Разделение по ролям",
    text: "Гости и владельцы работают в своих сценариях с отдельными интерфейсами."
  },
  {
    title: "Быстрые формы без лишнего",
    text: "Минимум полей для регистрации и бронирования. Каждое действие — в один шаг."
  },
  {
    title: "SMS и Telegram-подтверждения",
    text: "Верификация через привычные каналы. Надёжно и без сложных настроек."
  }
];

export function ModernFeatures() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Возможности</p>
        <h2>Всё, что нужно для запуска бронирования площадки.</h2>
      </div>
      <div className={styles.featureGrid}>
        {FEATURES.map(renderFeature)}
      </div>
    </section>
  );
}

function renderFeature(f: { text: string; title: string }) {
  return (
    <article key={f.title} className={styles.featureCard}>
      <span className={styles.featureAccent} />
      <h3>{f.title}</h3>
      <p>{f.text}</p>
    </article>
  );
}
