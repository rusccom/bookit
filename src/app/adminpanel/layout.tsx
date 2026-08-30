import type { Metadata } from "next";

import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { AdminSidebar } from "@/features/admin/ui/AdminSidebar";
import { createNoIndexMetadata } from "@/features/app/server/metadata";
import styles from "@/features/admin/ui/adminPanel.module.css";

export const metadata: Metadata = createNoIndexMetadata(
  "Панель администратора",
  "Закрытая панель управления BookCort."
);

export default async function AdminPanelLayout(props: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <div className={styles.adminPage}>
      <AdminSidebar login={admin.login} />
      <main className={styles.adminContent}>{props.children}</main>
    </div>
  );
}
