import Link from "next/link";

import s from "./landingForOwners.module.css";
import shared from "./landing.module.css";

const BENEFITS = [
  {
    title: "Быстрое подключение",
    text: "Добавьте свои корты за несколько минут — укажите расписание, цены и покрытие.",
  },
  {
    title: "Автоматическое расписание",
    text: "Система сама управляет слотами. Клиенты видят только свободное время.",
  },
  {
    title: "Аналитика и статистика",
    text: "Отслеживайте загрузку, доход и популярные часы в личном кабинете.",
  },
];

export function LandingForOwners() {
  return (
    <section className={shared.section}>
      <div className={shared.sectionHeader}>
        <h2>Для владельцев площадок</h2>
        <p>
          Подключите свои корты к платформе и получайте клиентов
          без дополнительных затрат на рекламу.
        </p>
      </div>
      <div className={s.grid}>
        <div className={s.benefits}>
          {BENEFITS.map((item) => (
            <article key={item.title} className={s.benefit}>
              <h3 className={s.benefitTitle}>{item.title}</h3>
              <p className={s.benefitText}>{item.text}</p>
            </article>
          ))}
        </div>
        <div className={s.cta}>
          <p className={s.ctaText}>
            Присоединяйтесь к площадкам, которые уже принимают
            бронирования онлайн.
          </p>
          <Link className={s.ctaButton} href="/register">
            Добавить площадку
          </Link>
        </div>
      </div>
    </section>
  );
}
