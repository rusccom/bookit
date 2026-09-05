import type { AvailabilityOption } from "@/features/booking/server/bookingTypes";
import styles from "./availability.module.css";

type Period = { from: number; label: string; to: number };
type Props = { options: AvailabilityOption[]; period: Period; select: (value: string | null) => void; selected: string | null };

export function SlotPeriod(props: Props) {
  const items = props.options.filter((item) => inPeriod(item.startTime, props.period));
  if (!items.length) return null;
  return <section className={styles.period}>
    <h4>{props.period.label}</h4>
    <div className={styles.slotGrid}>{items.map((item) => {
      const active = item.startTime === props.selected;
      const cls = active ? `${styles.slot} ${styles.selectedSlot}` : styles.slot;
      return <button aria-pressed={active} className={cls} key={item.startTime} onClick={() => props.select(active ? null : item.startTime)} type="button">
        <strong>{item.startTime}</strong><span>до {item.endTime}</span>
      </button>;
    })}</div>
  </section>;
}

function inPeriod(time: string, period: Period) {
  const hour = Number(time.slice(0, 2));
  return hour >= period.from && hour < period.to;
}
