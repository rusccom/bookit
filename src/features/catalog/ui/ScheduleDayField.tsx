import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import { formatMinutes } from "@/features/shared/server/dateTime";
import styles from "./courtManagement.module.css";

type Props = { defaultEnabled: boolean; label: string; rule?: AvailabilityRule; weekday: number };

export function ScheduleDayField(props: Props) {
  const start = props.rule ? formatMinutes(props.rule.startMinutes) : "08:00";
  const end = props.rule ? formatMinutes(props.rule.endMinutes) : "22:00";
  return <div className={styles.scheduleRow}>
    <label className={styles.dayToggle}><input defaultChecked={props.defaultEnabled} name={`day-${props.weekday}-enabled`} type="checkbox" value="true" /><span>{props.label}</span></label>
    <label><span>с</span><input aria-label={`${props.label}: начало`} defaultValue={start} name={`day-${props.weekday}-start`} step="1800" type="time" /></label>
    <label><span>до</span><input aria-label={`${props.label}: окончание`} defaultValue={end} name={`day-${props.weekday}-end`} step="1800" type="time" /></label>
  </div>;
}
