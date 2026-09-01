import styles from "./statusBanner.module.css";

const messages: Record<string, string> = {
  "booking-cancelled": "Бронирование отменено.",
  "booking-created": "Корт успешно забронирован.",
  "manual-booking-created": "Время закрыто для онлайн-бронирования.",
  "unit-created": "Корт создан, свободные слоты уже доступны клиентам.",
  "unit-status-updated": "Статус корта обновлён.",
  "unit-updated": "Данные корта и расписание сохранены."
};

type StatusBannerProps = {
  error?: string;
  success?: string;
};

export function StatusBanner(props: StatusBannerProps) {
  if (!props.error && !props.success) {
    return null;
  }

  const className = props.error ? `${styles.banner} ${styles.error}` : `${styles.banner} ${styles.success}`;

  const message = props.error || messages[props.success || ""] || props.success;
  return <div className={className}>{message}</div>;
}
