import { getAdminCatalog } from "@/features/admin/server/adminCatalogService";
import type { AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminCatalogTable } from "@/features/admin/ui/AdminCatalogTable";
import { AdminField } from "@/features/admin/ui/shared/AdminField";
import { AdminFilters } from "@/features/admin/ui/shared/AdminFilters";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import { getSearchParam as pick } from "@/features/shared/server/searchParams";

export default async function AdminCatalogPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const filters = { city: pick(params.city), search: pick(params.q), status: pick(params.status) };
  const items = await getAdminCatalog(filters);
  return <AdminPage eyebrow="Каталог" title="Объекты и корты" description={`Показано: ${items.length}${items.length === 300 ? ". Уточните фильтры: достигнут лимит 300 записей." : ""}`} error={pick(params.error)} success={pick(params.success)}>
    <AdminFilters search={filters.search} placeholder="Объект, корт, владелец">
      <AdminField label="Город"><input defaultValue={filters.city} name="city" placeholder="Город" /></AdminField>
      <AdminField label="Статус"><select defaultValue={filters.status} name="status">
        <option value="">Все статусы</option><option value="active">Активные</option><option value="inactive">Отключённые</option>
        <option value="no_schedule">Без доступного расписания</option><option value="no_price">Цена по запросу</option>
      </select></AdminField>
    </AdminFilters>
    <AdminCatalogTable items={items} {...filters} />
  </AdminPage>;
}
