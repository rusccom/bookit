import styles from "./landing.module.css";

const STEPS = [
  {
    step: "01",
    title: "Главная сразу сегментирует поток",
    text: "Лендинг не шумит: он разделяет гостя и владельца, показывает ценность и ведёт на нужный сценарий."
  },
  {
    step: "02",
    title: "Регистрация собирает только нужное",
    text: "Каждая форма сфокусирована на конкретной роли, поэтому вход в продукт ощущается быстрым и уверенным."
  },
  {
    step: "03",
    title: "Логин и переход в кабинет выглядят едино",
    text: "Пользователь не чувствует разрыва между маркетингом и продуктом, даже если дашборд будет жить в другом стиле."
  }
];

export function ModernFlow() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Маршрут пользователя</p>
        <h2>Новая публичная часть работает как аккуратный вход в продукт, а не как временная заглушка.</h2>
      </div>
      <div className={styles.flowGrid}>{STEPS.map(renderStep)}</div>
    </section>
  );
}

function renderStep(step: { step: string; text: string; title: string }) {
  return (
    <article key={step.step} className={styles.flowCard}>
      <span className={styles.flowStep}>{step.step}</span>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </article>
  );
}
