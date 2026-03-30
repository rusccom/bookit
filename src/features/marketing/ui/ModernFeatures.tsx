import styles from "./landing.module.css";

const FEATURES = [
  {
    title: "Общий стиль для главной, логина и регистрации",
    text: "Одна сетка, одна типографика, одна цветовая система и понятные состояния для действий."
  },
  {
    title: "Визуальная глубина без тяжёлого dark-mode шаблона",
    text: "Светлый фон, тёплые поверхности, глубокий тёмный текст и аккуратные зелёно-коралловые акценты."
  },
  {
    title: "Карточная архитектура для сценариев",
    text: "Маршруты гостей и владельцев поданы как отдельные продукты внутри одной платформы."
  },
  {
    title: "Формы, в которых легко закончить действие",
    text: "Чёткие подписи, читаемые поля и явный первичный CTA уменьшают трение на входе."
  }
];

export function ModernFeatures() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Что изменилось</p>
        <h2>Полностью пересобран ритм страницы: блоки, отступы, цвета, шрифты и акценты.</h2>
      </div>
      <div className={styles.featureGrid}>{FEATURES.map(renderFeature)}</div>
    </section>
  );
}

function renderFeature(feature: { text: string; title: string }) {
  return (
    <article key={feature.title} className={styles.featureCard}>
      <span className={styles.featureAccent} />
      <h3>{feature.title}</h3>
      <p>{feature.text}</p>
    </article>
  );
}
