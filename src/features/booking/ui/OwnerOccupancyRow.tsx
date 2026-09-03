import type { OwnerOccupancyItem } from "@/features/booking/server/ownerOccupancyTypes";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";
import styles from "./ownerOccupancy.module.css";

export function OwnerOccupancyRow({ item }: { item: OwnerOccupancyItem }) {
  return <tr><th scope="row"><strong>{item.unitTitle}</strong><small>{item.venueTitle} · {formatSlotMinutes(item.slotMinutes)}</small></th>
    {item.days.map((day) => <td key={day.date}>
      {day.total ? <><strong>{day.occupied} / {day.total}</strong><progress aria-label={`${item.unitTitle}, ${day.date}: занято ${day.occupied} из ${day.total} слотов`} className={styles.progress} max={day.total} value={day.occupied} /></> : <span className="muted">Выходной</span>}
    </td>)}
  </tr>;
}
