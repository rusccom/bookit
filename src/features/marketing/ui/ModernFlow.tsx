import styles from "./landing.module.css";

const STEPS = [
  {
    step: "01",
    title: "Регистрация за минуту",
    text: "Выберите роль — гость или владелец — и заполните короткую форму. Аккаунт готов сразу."
  },
  {
    step: "02",
    title: "Настройка или поиск",
    text: "Владелец добавляет площадку и расписание. Гость ищет свободные слоты и выбирает удобное время."
  },
  {
    step: "03",
    title: "Бронирование и управление",
    text: "Заявка уходит мгновенно. Управляйте бронями, получайте уведомления и следите за загрузкой."
  }
];

export function ModernFlow() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Как это работает</p>
        <h2>Три шага от регистрации до первой брони.</h2>
      </div>
      <div className={styles.flowGrid}>{STEPS.map(renderStep)}</div>
    </section>
  );
}

function renderStep(s: { step: string; text: string; title: string }) {
  return (
    <article key={s.step} className={styles.flowCard}>
      <span className={styles.flowStep}>{s.step}</span>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
    </article>
  );
}
