import { updateOwnerUnitAction } from "@/features/catalog/server/catalogActions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { CourtFormFields } from "@/features/catalog/ui/CourtFormFields";
import styles from "./courtManagement.module.css";

export function OwnerCourtEditForm({ unit }: { unit: OwnerUnit }) {
  return <form action={updateOwnerUnitAction} className={styles.courtForm}>
    <input name="unitId" type="hidden" value={unit.unitId} />
    <CourtFormFields unit={unit} />
    <div className={styles.formActions}>
      <button className="primary-button" type="submit">Сохранить изменения</button>
    </div>
  </form>;
}
