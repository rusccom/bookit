import {
  COURT_KIND_OPTIONS,
  COURT_SURFACE_OPTIONS
} from "@/features/catalog/courtOptions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import styles from "./courtManagement.module.css";

export function CourtIdentityFields({ unit }: { unit?: OwnerUnit }) {
  return <div className={styles.fieldGrid}>
    <label className={styles.wideField}><span>Название корта</span><input defaultValue={unit?.unitTitle} maxLength={100} name="title" placeholder="Центральный корт" required /></label>
    <label><span>Вид спорта</span><select defaultValue={unit?.kind || "tennis_court"} name="kind">{COURT_KIND_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
    <label><span>Покрытие</span><select defaultValue={unit?.surface || "hard"} name="surface">{COURT_SURFACE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
  </div>;
}
