import { listAdminAudit } from "@/features/admin/server/adminAuditRepository";
import { AdminAuditTable } from "@/features/admin/ui/AdminAuditTable";
import styles from "@/features/admin/ui/adminDataTable.module.css";
import workspace from "@/features/admin/ui/adminWorkspace.module.css";

type AdminAuditPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminAuditPage(props: AdminAuditPageProps) {
  const params = await props.searchParams;
  const search = pick(params.q);
  const records = await listAdminAudit(search);
  return <section className={workspace.page}><header className={workspace.pageHeader}><p>Безопасность</p><h1>Журнал действий</h1><span>Последние 200 административных операций.</span></header><form className={styles.filters} method="get"><input defaultValue={search} name="q" placeholder="Администратор, действие или ID" type="search" /><span /><span /><button type="submit">Найти</button></form><AdminAuditTable records={records} /></section>;
}

function pick(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
