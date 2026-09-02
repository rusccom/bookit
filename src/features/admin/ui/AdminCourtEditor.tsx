import { updateAdminCatalogAction } from "@/features/admin/server/adminCatalogActions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { CourtFormFields } from "@/features/catalog/ui/CourtFormFields";
import { AdminHiddenFields } from "./shared/AdminHiddenFields";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";
import styles from "@/features/catalog/ui/courtManagement.module.css";

type Props = { unit: OwnerUnit; city: string; search: string; status: string };

export function AdminCourtEditor({ unit, city, search, status }: Props) {
  return <form action={updateAdminCatalogAction} className={styles.courtForm}>
    <AdminHiddenFields values={{ unitId: unit.unitId, filterCity: city, search, filterStatus: status }} />
    <CourtFormFields unit={unit} />
    <div className={styles.formActions}><AdminSubmitButton>Сохранить корт и расписание</AdminSubmitButton></div>
  </form>;
}
