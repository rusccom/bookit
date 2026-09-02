import styles from "./availability.module.css";

export function EmptyAvailabilityResults({ searched }: { searched: boolean }) {
  const title = searched ? "Свободных слотов не найдено" : "Начните с параметров поиска";
  const text = searched
    ? "Попробуйте другую дату или уберите ограничение по времени. Если корт использует часовые или двухчасовые слоты, выберите соответствующую длительность записи."
    : "Мы покажем только актуальные свободные интервалы, которые можно забронировать прямо сейчас.";
  return <div className={styles.emptyResults}><strong>{title}</strong><p>{text}</p></div>;
}
