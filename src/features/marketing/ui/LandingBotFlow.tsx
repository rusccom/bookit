import s from "./landingBotFlow.module.css";
import shared from "./landing.module.css";

const FLOW = [
  {
    num: "01",
    title: "Напишите боту",
    example: "«Привет, хочу забронировать корт»",
    note: "Бот создаст аккаунт и спросит, что ищете",
  },
  {
    num: "02",
    title: "Бот находит варианты",
    example: "«Нашёл 3 корта рядом на завтра в 18:00»",
    note: "Фильтрует по локации, покрытию и цене",
  },
  {
    num: "03",
    title: "Подтвердите и играйте",
    example: "«Готово! Напомню за час до игры»",
    note: "Бронь оформлена — напоминание придёт автоматически",
  },
];

export function LandingBotFlow() {
  return (
    <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>От первого сообщения до игры</h2>
        <p>Три шага в Telegram — и корт ваш.</p>
      </div>
      <div className={s.timeline}>
        {FLOW.map((step, i) => (
          <article key={step.num} className={s.step}>
            <span className={s.num}>{step.num}</span>
            <div className={s.body}>
              <h3 className={s.title}>{step.title}</h3>
              <div className={s.bubble}>{step.example}</div>
              <p className={s.note}>{step.note}</p>
            </div>
            {i < FLOW.length - 1 && (
              <div className={s.connector} aria-hidden="true" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
