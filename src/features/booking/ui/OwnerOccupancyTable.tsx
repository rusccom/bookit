import type { OwnerOccupancyItem } from "@/features/booking/server/ownerOccupancyTypes";
import { OwnerOccupancyRow } from "./OwnerOccupancyRow";
import styles from "./ownerOccupancy.module.css";

export function OwnerOccupancyTable({ items, days }: { items: OwnerOccupancyItem[]; days: string[] }) {
  if (!items.length) return <div className="panel"><p>Нет активных кортов. Добавьте корт и настройте расписание.</p></div>;
  return <div aria-label="Загрузка активных кортов за неделю" className={styles.tableFrame} role="region" tabIndex={0}>
    <table className={styles.table}><caption>Занято слотов / всего по расписанию</caption>
      <thead><tr><th scope="col">Корт</th>{days.map((date) => <th key={date} scope="col">{formatDay(date)}</th>)}</tr></thead>
      <tbody>{items.map((item) => <OwnerOccupancyRow item={item} key={item.unitId} />)}</tbody>
    </table>
  </div>;
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
