import { getAdminOverviewStats } from "@/features/admin/server/adminOverviewRepository";
import { AdminOverviewCards } from "@/features/admin/ui/AdminOverviewCards";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();
  return <AdminPage eyebrow="Управление платформой" title="Обзор" description="Основные показатели BookCort на текущий момент.">
    <AdminOverviewCards stats={stats} />
  </AdminPage>;
}
