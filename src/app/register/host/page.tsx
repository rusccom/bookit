import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function RegisterHostPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = getSearchParam(searchParams.error);

  return (
    <ModernAuthLayout>
      <StatusBanner error={error} />
      <ModernRegisterForm role="owner" />
      <p className={styles.footer}>
        Хотите бронировать?{" "}
        <Link className={styles.link} href="/register/guest">
          Зарегистрироваться как клиент
        </Link>.
      </p>
    </ModernAuthLayout>
  );
}
