import { formatCourtKind, formatCourtSurface, formatHourlyPrice } from "@/features/catalog/courtOptions";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { OwnerCourtEditForm } from "@/features/catalog/ui/OwnerCourtEditForm";
import { OwnerCourtSchedule } from "@/features/catalog/ui/OwnerCourtSchedule";
import { OwnerCourtStatusForm } from "@/features/catalog/ui/OwnerCourtStatusForm";
import styles from "./courtManagement.module.css";

export function OwnerCourtCard({ unit }: { unit: OwnerUnit }) {
  const available = unit.isActive && unit.isVenueActive && unit.rules.length > 0;
  return <article className={styles.courtCard}>
    <div className={styles.cardHeader}><div><p>{unit.venueTitle}</p><h2>{unit.unitTitle}</h2></div><span className={available ? styles.activeBadge : styles.inactiveBadge}>{available ? "Доступен" : "Неактивен"}</span></div>
    <p className={styles.address}>{unit.city}, {unit.address}</p>
    <div className={styles.tags}><span>{formatCourtKind(unit.kind)}</span><span>{formatCourtSurface(unit.surface)}</span><span>Слот: {formatSlotMinutes(unit.slotMinutes)}</span><strong>{formatHourlyPrice(unit.pricePerHour, "Цена не указана")}</strong></div>
    {unit.description && <p className={styles.description}>{unit.description}</p>}
    <OwnerCourtSchedule rules={unit.rules} />
    {!unit.isVenueActive && <p className={styles.adminNotice}>Объект отключён администратором.</p>}
    <div className={styles.cardActions}><OwnerCourtStatusForm unit={unit} /></div>
    <details className={styles.editPanel}><summary>Редактировать корт и расписание</summary><OwnerCourtEditForm unit={unit} /></details>
  </article>;
}
