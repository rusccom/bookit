import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterChoice } from "@/features/auth/ui/ModernRegisterChoice";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = getSearchParam(searchParams.error);

  return (
    <ModernAuthLayout>
      <StatusBanner error={error} />
      <ModernRegisterChoice />
      <p className={styles.footer}>
        Уже есть аккаунт?{" "}
        <Link className={styles.link} href="/login">Войти</Link>.
      </p>
    </ModernAuthLayout>
  );
}
