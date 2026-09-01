import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import styles from "./courtManagement.module.css";

export function CourtLocationFields({ unit }: { unit?: OwnerUnit }) {
  return <div className={styles.fieldGrid}>
    <label><span>Город</span><input defaultValue={unit?.city} maxLength={80} name="city" placeholder="Минск" required /></label>
    <label><span>Название площадки</span><input defaultValue={unit?.venueTitle} maxLength={100} name="venueTitle" placeholder="Olympic Club" required /></label>
    <label className={styles.wideField}><span>Адрес</span><input defaultValue={unit?.address} maxLength={200} name="address" placeholder="пр-т Победителей, 10" required /></label>
  </div>;
}
