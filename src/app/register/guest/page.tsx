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
    <ModernAuthLayout
      description="Создайте аккаунт гостя, чтобы быстро находить свободные слоты и бронировать корты, залы и студии."
      title="Регистрация гостя"
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="customer" />
      <div className={styles.footer} style={{ marginTop: '16px' }}>
        Нужен аккаунт владельца? <Link className={styles.link} href="/register/host">Создайте его здесь</Link>
      </div>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
