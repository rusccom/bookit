import Link from "next/link";
import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { AuthFrame } from "@/features/auth/ui/AuthFrame";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

const highlights = [
  "Один вход для тех, кто бронирует, и для тех, кто принимает брони.",
  "После авторизации вы сразу попадёте в свой кабинет без лишних шагов.",
  "Регистрация и подтверждение номера остаются в одном прозрачном потоке."
];

export const metadata: Metadata = createNoIndexMetadata(
  "Вход",
  "Вход в кабинеты клиентов и владельцев пространств."
);

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <AuthFrame
      description="Войдите в аккаунт, чтобы управлять бронированиями или быстро вернуться к поиску свободных слотов."
      eyebrow="Bookit account"
      footer={<Link className="secondary-link" href="/register">Создать аккаунт</Link>}
      highlights={highlights}
      sideTitle="Что дальше"
      title="Вход для клиентов и владельцев пространств"
    >
      <StatusBanner error={error} />
      <LoginForm />
    </AuthFrame>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
