import { getAdminCatalog } from "@/features/admin/server/adminCatalogService";
import { getAdminParam as pick, type AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminCatalogTable } from "@/features/admin/ui/AdminCatalogTable";
import { AdminField } from "@/features/admin/ui/shared/AdminField";
import { AdminFilters } from "@/features/admin/ui/shared/AdminFilters";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";

export default async function AdminCatalogPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const filters = { city: pick(params.city), search: pick(params.q), status: pick(params.status) };
  const items = await getAdminCatalog(filters);
  return <AdminPage eyebrow="Каталог" title="Объекты и корты" description={"Найдено: " + items.length} error={pick(params.error)} success={pick(params.success)}>
    <AdminFilters search={filters.search} placeholder="Объект, корт, владелец">
      <AdminField label="Город"><input defaultValue={filters.city} name="city" placeholder="Город" /></AdminField>
      <AdminField label="Статус"><select defaultValue={filters.status} name="status">
        <option value="">Все статусы</option><option value="active">Активные</option><option value="inactive">Отключённые</option>
      </select></AdminField>
    </AdminFilters>
    <AdminCatalogTable items={items} {...filters} />
  </AdminPage>;
}
