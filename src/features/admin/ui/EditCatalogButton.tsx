import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { updateAdminCatalogAction } from "@/features/admin/server/adminCatalogActions";
import { AdminEditDialog } from "./shared/AdminEditDialog";
import { AdminField } from "./shared/AdminField";

type EditCatalogButtonProps = { city: string; item: AdminCatalogRecord; search: string; status: string };

export function EditCatalogButton({ city, item, search, status }: EditCatalogButtonProps) {
  const values = { unitId: item.unitId, venueId: item.venueId, search, filterCity: city, filterStatus: status };
  return <AdminEditDialog eyebrow="Каталог" title="Изменить объект" action={updateAdminCatalogAction} values={values}>
    <AdminField label="Название объекта"><input defaultValue={item.venueTitle} maxLength={100} name="venueTitle" required /></AdminField>
    <AdminField label="Город"><input defaultValue={item.city} maxLength={100} name="city" required /></AdminField>
    <AdminField label="Адрес"><input defaultValue={item.address} maxLength={200} name="address" required /></AdminField>
    <AdminField label="Название корта"><input defaultValue={item.unitTitle} maxLength={100} name="unitTitle" required /></AdminField>
  </AdminEditDialog>;
}
