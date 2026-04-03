import Link from "next/link";

import styles from "./auth.module.css";

const OPTIONS = [
  {
    href: "/register/guest",
    label: "Клиент",
    title: "Бронировать корты",
    text: "Быстрый поиск свободных слотов, моментальное бронирование и история заказов.",
    points: ["Быстрая регистрация", "Поиск и бронирование", "История броней"],
  },
  {
    href: "/register/host",
    label: "Арендодатель",
    title: "Сдавать корты в аренду",
    text: "Добавляйте объекты, настраивайте расписание и управляйте бронированиями из личного кабинета.",
    points: ["Управление объектами", "Гибкое расписание", "Панель аналитики"],
  },
];

export function ModernRegisterChoice() {
  return <div className={styles.choiceGrid}>{OPTIONS.map(renderOption)}</div>;
}

function renderOption(option: {
  href: string;
  label: string;
  points: string[];
  text: string;
  title: string;
}) {
  return (
    <Link key={option.href} className={styles.choiceCard} href={option.href}>
      <span className={styles.choiceBadge}>{option.label}</span>
      <h2>{option.title}</h2>
      <p>{option.text}</p>
      <ul className={styles.choiceList}>{option.points.map(renderPoint)}</ul>
      <span className={styles.choiceAction}>Открыть форму</span>
    </Link>
  );
}

function renderPoint(point: string) {
  return <li key={point}>{point}</li>;
}
