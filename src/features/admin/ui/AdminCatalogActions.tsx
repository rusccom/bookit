import type { AdminCatalogRecord } from "../server/adminTypes";
import { CatalogToggleForm } from "./CatalogToggleForm";
import { EditCatalogButton } from "./EditCatalogButton";
import { AdminActions } from "./shared/AdminActions";

type AdminCatalogActionsProps = { item: AdminCatalogRecord; city: string; search: string; status: string };

export function AdminCatalogActions({ item, ...filters }: AdminCatalogActionsProps) {
  return <AdminActions>
    <EditCatalogButton item={item} {...filters} />
    <CatalogToggleForm active={item.isUnitActive} entityId={item.unitId} entityType="unit" {...filters} />
    <CatalogToggleForm active={item.isVenueActive} entityId={item.venueId} entityType="venue" {...filters} />
  </AdminActions>;
}
