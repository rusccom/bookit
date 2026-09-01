import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { OwnerCourtCard } from "@/features/catalog/ui/OwnerCourtCard";
import styles from "./courtManagement.module.css";

export function OwnerCourtGrid({ units }: { units: OwnerUnit[] }) {
  if (!units.length) return <section className={styles.emptyState}><span>🎾</span><h2>Добавьте первый корт</h2><p>После настройки расписания клиенты сразу увидят свободные слоты.</p></section>;
  return <section className={styles.courtGrid}>{units.map((unit) => <OwnerCourtCard key={unit.unitId} unit={unit} />)}</section>;
}
