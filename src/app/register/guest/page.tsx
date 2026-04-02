import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const HIGHLIGHTS = [
  "Быстрая регистрация без лишних данных",
  "Сразу после создания — доступ к поиску слотов",
  "Телефон используется для подтверждения брони"
];

export default async function RegisterGuestPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Создайте аккаунт гостя и начните бронировать площадки."
      eyebrow="Гость"
      highlights={HIGHLIGHTS}
      title="Регистрация для бронирования."
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="customer" />
      <p className={styles.footer}>
        Владелец площадки?{" "}
        <Link className={styles.link} href="/register/host">
          Зарегистрироваться как владелец
        </Link>.
      </p>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
