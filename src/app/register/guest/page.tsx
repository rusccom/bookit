import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function RegisterGuestPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = getSearchParam(searchParams.error);

  return (
    <ModernAuthLayout>
      <StatusBanner error={error} />
      <ModernRegisterForm role="customer" />
      <p className={styles.footer}>
        Арендодатель?{" "}
        <Link className={styles.link} href="/register/host">
          Зарегистрироваться как арендодатель
        </Link>.
      </p>
    </ModernAuthLayout>
  );
}
