import { SLOT_OPTIONS } from "@/features/catalog/slotOptions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import styles from "./courtManagement.module.css";

export function CourtSlotField({ unit }: { unit?: OwnerUnit }) {
  return <div className={styles.fieldGrid}>
    <label><span>Шаг слотов</span><select defaultValue={unit?.slotMinutes ?? 30} name="slotMinutes" required>
      {SLOT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select></label>
    <p>Слоты отсчитываются от открытия. Длительность записи кратна выбранному шагу. Неполный интервал перед закрытием не отображается. Изменения не отменяют существующие бронирования.</p>
  </div>;
}
