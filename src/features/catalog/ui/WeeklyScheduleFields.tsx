import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { ScheduleDayField } from "@/features/catalog/ui/ScheduleDayField";
import styles from "./courtManagement.module.css";

const DAYS = [
  { label: "Понедельник", weekday: 1 }, { label: "Вторник", weekday: 2 },
  { label: "Среда", weekday: 3 }, { label: "Четверг", weekday: 4 },
  { label: "Пятница", weekday: 5 }, { label: "Суббота", weekday: 6 },
  { label: "Воскресенье", weekday: 0 }
];

export function WeeklyScheduleFields({ unit }: { unit?: OwnerUnit }) {
  return <fieldset className={styles.schedule}>
    <legend>Еженедельное расписание</legend>
    <p>Отметьте рабочие дни и задайте отдельное время для каждого дня. Слоты создаются каждые 30 минут.</p>
    {DAYS.map((day) => {
      const rule = unit?.rules.find((item) => item.weekday === day.weekday);
      const enabled = unit ? Boolean(rule) : day.weekday >= 1 && day.weekday <= 5;
      return <ScheduleDayField key={day.weekday} {...day} defaultEnabled={enabled} rule={rule} />;
    })}
  </fieldset>;
}
