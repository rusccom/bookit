import s from "./landingTestimonials.module.css";
import shared from "./landing.module.css";

const TESTIMONIALS = [
  {
    name: "Алексей М.",
    role: "Игрок",
    text: "Раньше тратил полчаса на звонки, а теперь бронирую корт за минуту. Очень удобное расписание — сразу видно, что свободно.",
  },
  {
    name: "Ирина К.",
    role: "Владелец площадки",
    text: "Подключила свои корты за 10 минут. Теперь клиенты бронируют сами, а я вижу всю загрузку в личном кабинете.",
  },
  {
    name: "Дмитрий С.",
    role: "Игрок",
    text: "Telegram-бот — это огонь. Написал «корт на субботу в 10» и через секунду получил подтверждение. Будущее уже здесь.",
  },
];

export function LandingTestimonials() {
  return (
    <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Что говорят пользователи</h2>
        <p>Отзывы игроков и владельцев площадок о работе с BookCort.</p>
      </div>
      <div className={s.grid}>
        {TESTIMONIALS.map((item) => (
          <article key={item.name} className={s.card}>
            <p className={s.text}>&laquo;{item.text}&raquo;</p>
            <div className={s.author}>
              <span className={s.avatar}>
                {item.name.charAt(0)}
              </span>
              <div className={s.authorInfo}>
                <span className={s.name}>{item.name}</span>
                <span className={s.role}>{item.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
