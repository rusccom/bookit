import Link from "next/link";

import styles from "./landing.module.css";

const AUDIENCES = [
  {
    id: "guests",
    label: "Для гостей",
    title: "Ищете зал, корт, студию или лофт без длинной переписки",
    text: "Выбираете сценарий, создаёте аккаунт и сразу переходите к свободным окнам и быстрым подтверждениям.",
    points: ["Чистый маршрут от главной до регистрации", "Понятные формы без лишних полей", "Быстрый вход в свой кабинет"],
    href: "/register/guest",
    cta: "Создать аккаунт гостя"
  },
  {
    id: "owners",
    label: "Для владельцев",
    title: "Запускаете площадку и хотите выглядеть как современный сервис",
    text: "Bookit собирает публичный вход в продукт: презентация, регистрация, логин и понятный переход к управлению бронированиями.",
    points: ["Единая витрина бренда", "Форма с нужными данными для запуска", "Отдельный визуальный язык от дашборда"],
    href: "/register/host",
    cta: "Подключить площадку"
  }
];

export function ModernAudience() {
  return (
    <section className={styles.section} id="audiences">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Два сценария, один визуальный язык</p>
        <h2>Публичная часть теперь сразу объясняет, куда идти гостю и владельцу.</h2>
      </div>
      <div className={styles.audienceGrid}>{AUDIENCES.map(renderAudience)}</div>
    </section>
  );
}

function renderAudience(audience: {
  cta: string;
  href: string;
  id: string;
  label: string;
  points: string[];
  text: string;
  title: string;
}) {
  return (
    <article key={audience.id} className={styles.audienceCard} id={audience.id}>
      <span className={styles.audienceTag}>{audience.label}</span>
      <h3>{audience.title}</h3>
      <p>{audience.text}</p>
      <ul className={styles.audienceList}>{audience.points.map(renderPoint)}</ul>
      <Link className={styles.textLink} href={audience.href}>{audience.cta}</Link>
    </article>
  );
}

function renderPoint(point: string) {
  return <li key={point}>{point}</li>;
}
