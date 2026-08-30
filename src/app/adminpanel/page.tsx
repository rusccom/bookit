import { getAdminOverviewStats } from "@/features/admin/server/adminOverviewRepository";
import { AdminOverviewCards } from "@/features/admin/ui/AdminOverviewCards";
import styles from "@/features/admin/ui/adminWorkspace.module.css";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();
  return <section className={styles.page}>
    <header className={styles.pageHeader}><p>Управление платформой</p><h1>Обзор</h1><span>Основные показатели BookCort на текущий момент.</span></header>
    <AdminOverviewCards stats={stats} />
  </section>;
}
