import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const HIGHLIGHTS = [
  "Регистрация с указанием названия площадки",
  "Доступ к панели управления расписанием",
  "Публичная витрина для привлечения гостей"
];

export default async function RegisterHostPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Создайте аккаунт владельца и настройте площадку для приёма бронирований."
      eyebrow="Владелец"
      highlights={HIGHLIGHTS}
      title="Регистрация для площадок."
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="owner" />
      <p className={styles.footer}>
        Хотите бронировать?{" "}
        <Link className={styles.link} href="/register/guest">
          Зарегистрироваться как гость
        </Link>.
      </p>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
