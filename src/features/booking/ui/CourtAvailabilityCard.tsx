import { formatCourtKind, formatCourtSurface } from "@/features/catalog/courtOptions";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";
import type { AvailabilityResult } from "@/features/booking/server/bookingTypes";
import { SlotTimeline } from "@/features/booking/ui/SlotTimeline";
import styles from "./availability.module.css";

type Props = { date: string; durationMinutes: number; item: AvailabilityResult; returnTo: string };

export function CourtAvailabilityCard(props: Props) {
  const item = props.item;
  return <article className={styles.courtCard}>
    <header className={styles.courtHeader}><div><p>{item.venueTitle}</p><h2>{item.unitTitle}</h2><span>{item.city}, {item.address}</span></div><strong>{formatPrice(item.pricePerHour)}</strong></header>
    <div className={styles.courtTags}><span>{formatCourtKind(item.kind)}</span><span>{formatCourtSurface(item.surface)}</span><span>Шаг слотов: {formatSlotMinutes(item.slotMinutes)}</span></div>
    {item.description && <p className={styles.courtDescription}>{item.description}</p>}
    <SlotTimeline date={props.date} durationMinutes={props.durationMinutes} options={item.options} pricePerHour={item.pricePerHour} returnTo={props.returnTo} unitId={item.unitId} />
  </article>;
}

function formatPrice(value: number) {
  return value > 0 ? `${value.toFixed(2)} BYN/ч` : "Цена по запросу";
}
