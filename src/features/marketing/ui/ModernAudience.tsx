import Link from "next/link";

import styles from "./landing.module.css";

const AUDIENCES = [
  {
    id: "guests",
    label: "Для гостей",
    title: "Быстрый поиск и бронирование свободных слотов",
    text: "Выбирайте площадку, смотрите расписание и бронируйте в пару кликов. Без звонков, без ожидания ответа.",
    points: [
      "Мгновенный доступ к свободным окнам",
      "Простая регистрация без лишних полей",
      "Личный кабинет с историей бронирований"
    ],
    href: "/register/guest",
    cta: "Создать аккаунт гостя"
  },
  {
    id: "owners",
    label: "Для владельцев",
    title: "Управление площадкой и расписанием в одном месте",
    text: "Настройте график работы, управляйте заявками и контролируйте загрузку пространства через удобный кабинет.",
    points: [
      "Гибкое управление слотами и расписанием",
      "Автоматические уведомления о бронях",
      "Аналитика загрузки площадки"
    ],
    href: "/register/host",
    cta: "Подключить площадку"
  }
];

export function ModernAudience() {
  return (
    <section className={styles.section} id="audiences">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Два сценария</p>
        <h2>Одна платформа для гостей и владельцев площадок.</h2>
      </div>
      <div className={styles.audienceGrid}>
        {AUDIENCES.map(renderCard)}
      </div>
    </section>
  );
}

function renderCard(a: (typeof AUDIENCES)[number]) {
  return (
    <article key={a.id} className={styles.audienceCard} id={a.id}>
      <span className={styles.audienceTag}>{a.label}</span>
      <h3>{a.title}</h3>
      <p>{a.text}</p>
      <ul className={styles.audienceList}>
        {a.points.map(renderPoint)}
      </ul>
      <Link className={styles.textLink} href={a.href}>{a.cta}</Link>
    </article>
  );
}

function renderPoint(point: string) {
  return <li key={point}>{point}</li>;
}
