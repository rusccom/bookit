import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterHostPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Создайте аккаунт владельца, чтобы публиковать объекты, открывать слоты и получать гарантированные бронирования."
      title="Регистрация владельца"
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="owner" />
      <div className={styles.footer} style={{ marginTop: '16px' }}>
        Хотите просто забронировать место? <Link className={styles.link} href="/register/guest">Создайте аккаунт гостя</Link>
      </div>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
