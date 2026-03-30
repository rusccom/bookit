import Link from "next/link";

import styles from "./auth.module.css";

const OPTIONS = [
  {
    href: "/register/guest",
    label: "Аккаунт гостя",
    title: "Найти пространство и быстро забронировать свободный слот",
    text: "Подходит для клиентов, которые хотят войти, выбрать площадку и дойти до брони без лишних вопросов.",
    points: ["Быстрый старт", "Чистая анкета", "Удобный вход"]
  },
  {
    href: "/register/host",
    label: "Аккаунт владельца",
    title: "Запустить площадку и привести пользователя к будущему кабинету",
    text: "Подходит для команд, которым нужен уверенный публичный вход в продукт: витрина, регистрация и переход к управлению.",
    points: ["Отдельный маршрут для владельца", "Поле для названия бренда", "Подготовка к дашборду"]
  }
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
