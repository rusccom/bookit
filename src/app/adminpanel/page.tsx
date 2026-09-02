import { getAdminOverviewStats } from "@/features/admin/server/adminOverviewRepository";
import { AdminOverviewCards } from "@/features/admin/ui/AdminOverviewCards";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import { getAdminCatalogAttention } from "@/features/admin/server/adminCatalogRepository";
import { AdminCatalogAttention } from "@/features/admin/ui/AdminCatalogAttention";

export default async function AdminOverviewPage() {
  const [stats, attention] = await Promise.all([getAdminOverviewStats(), getAdminCatalogAttention()]);
  return <AdminPage eyebrow="Управление платформой" title="Обзор" description="Основные показатели BookCort на текущий момент.">
    <AdminOverviewCards stats={stats} />
    <AdminCatalogAttention counts={attention} />
  </AdminPage>;
}
