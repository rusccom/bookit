import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/features/admin/server/requireAdmin";
import { AdminLoginForm } from "@/features/admin/ui/AdminLoginForm";
import { createNoIndexMetadata } from "@/features/app/server/metadata";
import styles from "@/features/admin/ui/adminLogin.module.css";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

export const metadata: Metadata = createNoIndexMetadata(
  "Вход администратора",
  "Закрытый вход в панель управления."
);

type AdminLoginPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AdminLoginPage(props: AdminLoginPageProps) {
  if (await getCurrentAdmin()) redirect("/adminpanel");
  const params = await props.searchParams;
  const error = getSearchParam(params.error);
  return (
    <main className={styles.loginPage}>
      <AdminLoginForm error={error} />
    </main>
  );
}
