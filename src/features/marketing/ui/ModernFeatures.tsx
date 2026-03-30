import styles from "./landing.module.css";

const features = [
  {
    icon: "⚡",
    title: "Моментальное подтверждение",
    desc: "Больше никаких долгих ожиданий. Все слоты синхронизируются в реальном времени.",
    isWide: false
  },
  {
    icon: "🎨",
    title: "Современный интерфейс",
    desc: "Обновленный дизайн Bookit позволяет вам сделать все быстрее и получать эстетическое удовольствие от процесса аренды.",
    isWide: true
  },
  {
    icon: "🛡️",
    title: "Полный контроль",
    desc: "Для владельцев: удобное управление правилами, слотами и финансами в одном месте.",
    isWide: true
  },
  {
    icon: "🔔",
    title: "Умные уведомления",
    desc: "Вы и ваши гости всегда в курсе событий с помощью PUSH и SMS напоминаний.",
    isWide: false
  }
];

export function ModernFeatures() {
  return (
    <section className={styles.features} id="features">
      <header className={styles.sectionHeader}>
        <h2>Почему выбирают Bookit?</h2>
        <p>Мы продумали каждый шаг на пути бронирования</p>
      </header>
      <div className={styles.bentoGrid}>
        {features.map((f, i) => (
          <div key={i} className={`${styles.bentoCard} ${f.isWide ? styles.bentoWide : ""}`}>
            <span className={styles.bentoIcon}>{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
