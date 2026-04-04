import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterGuestPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

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

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
