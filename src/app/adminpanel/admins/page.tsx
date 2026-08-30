import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { getAdminSecurityData } from "@/features/admin/server/adminSecurityService";
import { AdminAccountsTable } from "@/features/admin/ui/AdminAccountsTable";
import { AdminCreateForm } from "@/features/admin/ui/AdminCreateForm";
import { AdminPasswordForm } from "@/features/admin/ui/AdminPasswordForm";
import { AdminSessionsTable } from "@/features/admin/ui/AdminSessionsTable";
import { AdminTwoFactorPanel } from "@/features/admin/ui/AdminTwoFactorPanel";
import styles from "@/features/admin/ui/adminSecurity.module.css";
import workspace from "@/features/admin/ui/adminWorkspace.module.css";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type AdminsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminsPage(props: AdminsPageProps) {
  const params = await props.searchParams;
  const admin = await requireAdmin();
  const data = await getAdminSecurityData(admin);
  return <section className={workspace.page}><StatusBanner error={pick(params.error)} success={pick(params.success)} /><header className={workspace.pageHeader}><p>Безопасность</p><h1>Администраторы</h1><span>Аккаунты, пароли, 2FA и активные устройства.</span></header><div className={styles.grid}><AdminCreateForm /><AdminPasswordForm /><AdminTwoFactorPanel enabled={data.twoFactorEnabled} setup={data.twoFactorSetup} /></div><AdminAccountsTable admins={data.admins} currentAdminId={data.currentAdminId} /><AdminSessionsTable sessions={data.sessions} /></section>;
}

function pick(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
