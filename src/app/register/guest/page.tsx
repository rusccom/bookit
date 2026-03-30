import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const HIGHLIGHTS = [
  "Форма собрана под гостя и не заставляет думать о настройке площадки.",
  "После регистрации можно сразу переходить к поиску свободных слотов.",
  "Номер телефона остаётся точкой подтверждения и безопасности аккаунта."
];

export default async function RegisterGuestPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Создайте аккаунт гостя и войдите в чистый сценарий поиска, выбора и будущего бронирования."
      eyebrow="Гость"
      highlights={HIGHLIGHTS}
      title="Регистрация для тех, кто хочет быстро бронировать."
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="customer" />
      <p className={styles.footer}>Нужен аккаунт владельца? <Link className={styles.link} href="/register/host">Открыть форму владельца</Link>.</p>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
