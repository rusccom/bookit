import { RegisterChoiceCard } from "./RegisterChoiceCard";
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
  return <div className={styles.choiceGrid}>{OPTIONS.map((option) => <RegisterChoiceCard key={option.href} option={option} />)}</div>;
}
