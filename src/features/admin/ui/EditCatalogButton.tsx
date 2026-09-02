import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { AdminLink } from "./shared/AdminLink";

type Props = { city: string; item: AdminCatalogRecord; search: string; status: string };

export function EditCatalogButton({ city, item, search, status }: Props) {
  const params = new URLSearchParams({ city, q: search, status });
  return <AdminLink button href={`/adminpanel/catalog/${item.unitId}?${params}`}>Корт и расписание</AdminLink>;
}
