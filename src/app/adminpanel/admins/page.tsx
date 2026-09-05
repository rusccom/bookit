import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { getAdminSecurityData } from "@/features/admin/server/adminSecurityService";
import type { AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminAccountsTable } from "@/features/admin/ui/AdminAccountsTable";
import { AdminCreateForm } from "@/features/admin/ui/AdminCreateForm";
import { AdminPasswordForm } from "@/features/admin/ui/AdminPasswordForm";
import { AdminSessionsTable } from "@/features/admin/ui/AdminSessionsTable";
import { AdminTwoFactorPanel } from "@/features/admin/ui/AdminTwoFactorPanel";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import styles from "@/features/admin/ui/adminSecurity.module.css";
import { getSearchParam as pick } from "@/features/shared/server/searchParams";

export default async function AdminsPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const admin = await requireAdmin();
  const data = await getAdminSecurityData(admin);
  return <AdminPage eyebrow="Безопасность" title="Администраторы" description="Аккаунты, пароли, 2FA и активные устройства." error={pick(params.error)} success={pick(params.success)}>
    <div className={styles.grid}><AdminCreateForm /><AdminPasswordForm /><AdminTwoFactorPanel enabled={data.twoFactorEnabled} setup={data.twoFactorSetup} /></div>
    <AdminAccountsTable admins={data.admins} currentAdminId={data.currentAdminId} />
    <AdminSessionsTable sessions={data.sessions} />
  </AdminPage>;
}
