import { listAdminAudit } from "@/features/admin/server/adminAuditRepository";
import type { AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminAuditTable } from "@/features/admin/ui/AdminAuditTable";
import { AdminFilters } from "@/features/admin/ui/shared/AdminFilters";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import { getSearchParam as pick } from "@/features/shared/server/searchParams";

export default async function AdminAuditPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const search = pick(params.q);
  const records = await listAdminAudit(search);
  return <AdminPage eyebrow="Безопасность" title="Журнал действий" description="Последние 200 административных операций.">
    <AdminFilters search={search} placeholder="Администратор, действие или ID" />
    <AdminAuditTable records={records} />
  </AdminPage>;
}
