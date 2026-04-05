import s from "./landingHowItWorks.module.css";
import shared from "./landing.module.css";

const STEPS = [
  {
    num: "01",
    title: "Выберите площадку",
    text: "Найдите подходящий корт по расположению, покрытию или цене.",
  },
  {
    num: "02",
    title: "Укажите дату и время",
    text: "Смотрите свободные слоты в реальном времени и выбирайте удобный.",
  },
  {
    num: "03",
    title: "Подтвердите бронь",
    text: "Один клик — и корт ваш. Подтверждение приходит моментально.",
  },
  {
    num: "04",
    title: "Играйте!",
    text: "Приходите в назначенное время. Всё готово — просто наслаждайтесь игрой.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Как это работает</h2>
        <p>Четыре простых шага от выбора до игры на корте.</p>
      </div>
      <div className={s.steps}>
        {STEPS.map((step) => (
          <article key={step.num} className={s.step}>
            <span className={s.num}>{step.num}</span>
            <h3 className={s.stepTitle}>{step.title}</h3>
            <p className={s.stepText}>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
