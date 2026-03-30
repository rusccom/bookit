import Link from "next/link";

import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernRegisterForm } from "@/features/auth/ui/ModernRegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const HIGHLIGHTS = [
  "Публичная регистрация владельца сразу выглядит как часть полноценного сервиса.",
  "Название бренда или площадки закладывается уже на входе в продукт.",
  "После логина дизайн кабинета можно будет развивать отдельно, не ломая публичную часть."
];

export default async function RegisterHostPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Создайте аккаунт владельца и подготовьте понятный маршрут к управлению расписанием и бронированиями."
      eyebrow="Владелец"
      highlights={HIGHLIGHTS}
      title="Регистрация для площадок, студий и залов."
    >
      <StatusBanner error={error} />
      <ModernRegisterForm role="owner" />
      <p className={styles.footer}>Нужен только поиск площадок? <Link className={styles.link} href="/register/guest">Открыть форму гостя</Link>.</p>
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
