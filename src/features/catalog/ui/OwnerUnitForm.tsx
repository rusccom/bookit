import { createOwnerUnitAction } from "@/features/catalog/server/catalogActions";
import { CourtFormFields } from "@/features/catalog/ui/CourtFormFields";
import styles from "./courtManagement.module.css";

export function OwnerUnitForm({ openByDefault }: { openByDefault: boolean }) {
  return <details className={styles.createPanel} open={openByDefault}>
    <summary><span>Добавить новый корт</span><small>Адрес, параметры и расписание</small></summary>
    <form action={createOwnerUnitAction} className={styles.courtForm}>
      <CourtFormFields />
      <button className="primary-button" type="submit">Создать корт и слоты</button>
    </form>
  </details>;
}
