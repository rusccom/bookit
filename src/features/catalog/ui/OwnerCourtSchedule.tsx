import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import { formatMinutes } from "@/features/shared/server/dateTime";
import styles from "./courtManagement.module.css";

const DAY_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function OwnerCourtSchedule({ rules }: { rules: AvailabilityRule[] }) {
  if (!rules.length) return <p className={styles.noSchedule}>Расписание не настроено</p>;
  return <div className={styles.scheduleChips}>{rules.map((rule) =>
    <span key={rule.id}>{DAY_LABELS[rule.weekday]} {formatMinutes(rule.startMinutes)}–{formatMinutes(rule.endMinutes)}</span>
  )}</div>;
}
