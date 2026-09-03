import type { OccupancyTotals } from "@/features/booking/server/ownerOccupancyTypes";
import styles from "./owner.module.css";

export function OwnerOccupancySummary({ totals }: { totals: OccupancyTotals }) {
  const items = [
    { label: "Заполненность слотов", value: `${totals.percent}%` },
    { label: "Занято слотов", value: `${totals.occupied} из ${totals.total}` },
    { label: "Свободно слотов", value: totals.free }
  ];
  return <div className={styles.statsRow}>{items.map((item) => <div className={styles.statCard} key={item.label}>
    <strong className={styles.statValue}>{item.value}</strong><span className={styles.statLabel}>{item.label}</span>
  </div>)}</div>;
}
