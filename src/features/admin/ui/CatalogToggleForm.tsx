import { toggleAdminCatalogAction } from "@/features/admin/server/adminCatalogActions";
import { AdminActionForm } from "./shared/AdminActionForm";

type CatalogToggleFormProps = {
  active: boolean;
  city: string;
  entityId: string;
  entityType: "unit" | "venue";
  search: string;
  status: string;
};

export function CatalogToggleForm({ active, city, entityId, entityType, search, status }: CatalogToggleFormProps) {
  const label = active ? "Отключить" : "Включить";
  const values = { entityId, entityType, active: String(!active), search, filterCity: city, filterStatus: status };
  return <AdminActionForm action={toggleAdminCatalogAction} values={values} confirmation={label + " выбранную позицию?"}>
    {label} {entityType === "unit" ? "корт" : "объект"}
  </AdminActionForm>;
}
