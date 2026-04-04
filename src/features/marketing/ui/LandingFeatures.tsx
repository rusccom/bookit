import s from "./landing.module.css";

const FEATURES = [
  {
    title: "Мгновенное бронирование",
    text: "Выберите дату, время и корт — система моментально подтвердит бронь. Никаких звонков и ожиданий.",
  },
  {
    title: "Гибкое расписание",
    text: "Владельцы настраивают доступность по дням и часам. Клиенты видят только свободные слоты в реальном времени.",
  },
  {
    title: "Управление из одного окна",
    text: "Личный кабинет для арендодателя: все объекты, бронирования и статистика в одном месте.",
  },
];

export function LandingFeatures() {
  return (
    <section className={s.section}>
      <div className={`${s.sectionHeader} ${s.sectionHeaderCentered}`}>
        <h2>Возможности платформы</h2>
        <p>
          Всё, что нужно для удобной аренды — от быстрого поиска
          до полного управления расписанием.
        </p>
      </div>
      <div className={s.cardGrid}>
        {FEATURES.map((item) => (
          <article key={item.title} className={s.card}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
