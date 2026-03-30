import Link from "next/link";
import styles from "./auth.module.css";

const options = [
  {
    icon: "🎾",
    title: "Для гостей",
    description: "Находите идеальные корты, студии и залы для своих тренировок. Бронируйте в пару кликов.",
    href: "/register/guest",
    cta: "Начать бронировать"
  },
  {
    icon: "🏢",
    title: "Для владельцев",
    description: "Управляйте своим пространством легко. Получайте постоянный поток бронирований и удобное расписание.",
    href: "/register/host",
    cta: "Добавить площадку"
  }
];

export function ModernRegisterChoice() {
  return (
    <div className={styles.choiceGrid}>
      {options.map((option) => (
        <Link key={option.href} href={option.href} className={styles.choiceCard}>
          <div className={styles.cardIcon}>{option.icon}</div>
          <h3>{option.title}</h3>
          <p>{option.description}</p>
          <span className={styles.cardAction}>
            {option.cta} <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
