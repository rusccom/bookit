import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterChoice } from "@/features/auth/ui/ModernRegisterChoice";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

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

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
