import { getAdminCatalog } from "@/features/admin/server/adminCatalogService";
import { AdminCatalogTable } from "@/features/admin/ui/AdminCatalogTable";
import styles from "@/features/admin/ui/adminDataTable.module.css";
import workspace from "@/features/admin/ui/adminWorkspace.module.css";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type AdminCatalogPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminCatalogPage(props: AdminCatalogPageProps) {
  const params = await props.searchParams;
  const filters = { city: pick(params.city), search: pick(params.q), status: pick(params.status) };
  const items = await getAdminCatalog(filters);
  return <section className={workspace.page}><StatusBanner error={pick(params.error)} success={pick(params.success)} /><header className={workspace.pageHeader}><p>Каталог</p><h1>Объекты и корты</h1><span>Найдено: {items.length}</span></header><form className={styles.filters} method="get"><input defaultValue={filters.search} name="q" placeholder="Объект, корт, владелец" type="search" /><input defaultValue={filters.city} name="city" placeholder="Город" /><select defaultValue={filters.status} name="status"><option value="">Все статусы</option><option value="active">Активные</option><option value="inactive">Отключённые</option></select><button type="submit">Применить</button></form><AdminCatalogTable city={filters.city} items={items} search={filters.search} status={filters.status} /></section>;
}

function pick(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
