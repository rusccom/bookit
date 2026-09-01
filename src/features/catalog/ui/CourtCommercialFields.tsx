import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import styles from "./courtManagement.module.css";

export function CourtCommercialFields({ unit }: { unit?: OwnerUnit }) {
  return <div className={styles.fieldGrid}>
    <label><span>Цена за час, BYN</span><input defaultValue={unit?.pricePerHour ?? 0} max="10000" min="0" name="pricePerHour" required step="0.01" type="number" /></label>
    <label className={styles.wideField}><span>Описание</span><textarea defaultValue={unit?.description} maxLength={500} name="description" placeholder="Освещение, раздевалки, инвентарь и другие важные детали" rows={3} /></label>
  </div>;
}
