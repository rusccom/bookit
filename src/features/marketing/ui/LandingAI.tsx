import s from "./landing.module.css";

const AI_FEATURES = [
  {
    title: "Бронь через чат",
    text: "Напишите AI-ассистенту в Telegram — он найдёт свободный слот и оформит бронь за вас.",
  },
  {
    title: "Естественный язык",
    text: "Просто скажите «хочу корт на завтра в 18:00» — ассистент всё поймёт и предложит варианты.",
  },
  {
    title: "Подтверждение в один клик",
    text: "Ассистент предложит вариант — подтвердите или отклоните прямо в мессенджере, без перехода на сайт.",
  },
];

export function LandingAI() {
  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2>AI-ассистент в твоём мессенджере</h2>
        <p>
          Бронируйте корты через Telegram — без приложений и регистрации.
          Просто напишите, что нужно.
        </p>
      </div>
      <div className={s.cardGrid}>
        {AI_FEATURES.map((item, i) => (
          <article key={item.title} className={s.card}>
            <span className={s.cardNumber}>{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
