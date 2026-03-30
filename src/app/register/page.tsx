import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterChoice } from "@/features/auth/ui/ModernRegisterChoice";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import Link from "next/link";
import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      title="Начните работу с Bookit"
      description="Выберите подходящий сценарий: найти идеальное пространство для себя или начать сдавать своё."
      large={true}
    >
      <StatusBanner error={error} />
      <ModernRegisterChoice />
      <div className={styles.footer} style={{ marginTop: '24px' }}>
        Уже есть аккаунт? <Link href="/login" className={styles.link}>Войти</Link>
      </div>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
