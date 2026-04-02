import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernLoginForm } from "@/features/auth/ui/ModernLoginForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

export const metadata: Metadata = createNoIndexMetadata(
  "Вход",
  "Вход в кабинет Bookit для гостей и владельцев площадок."
);

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const HIGHLIGHTS = [
  "Единый вход для гостей и владельцев площадок",
  "После авторизации — сразу в личный кабинет",
  "Безопасная аутентификация с шифрованием данных"
];

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Войдите в свой аккаунт, чтобы управлять бронированиями и площадками."
      eyebrow="Авторизация"
      highlights={HIGHLIGHTS}
      title="С возвращением в Bookit."
    >
      <StatusBanner error={error} />
      <ModernLoginForm />
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
