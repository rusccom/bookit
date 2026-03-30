import Link from "next/link";

import type { UserRole } from "@/features/auth/server/authTypes";
import { getRegisterPath } from "@/features/auth/server/registrationPaths";
import { AuthFrame } from "@/features/auth/ui/AuthFrame";
import { RegisterVerificationForm } from "@/features/auth/ui/RegisterVerificationForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterVerifyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const role = resolveRole(searchParams.role);
  const error = pickValue(searchParams.error);
  const success = pickValue(searchParams.success);

  return (
    <AuthFrame
      description="Введите код из SMS, чтобы завершить регистрацию и сразу перейти в свой кабинет."
      eyebrow="Подтверждение"
      footer={<Link className="secondary-link" href={getRegisterPath(role)}>Вернуться к анкете</Link>}
      highlights={getHighlights(role)}
      sideTitle="Что происходит сейчас"
      title={role === "owner" ? "Подтвердите аккаунт владельца" : "Подтвердите аккаунт гостя"}
    >
      <StatusBanner error={error} success={success} />
      <RegisterVerificationForm />
    </AuthFrame>
  );
}

function getHighlights(role: UserRole) {
  return role === "owner" ? OWNER_HIGHLIGHTS : GUEST_HIGHLIGHTS;
}

function resolveRole(value: string | string[] | undefined): UserRole {
  return pickValue(value) === "owner" ? "owner" : "customer";
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const GUEST_HIGHLIGHTS = [
  "Код нужен только для завершения регистрации и защиты вашего аккаунта.",
  "После подтверждения вы сразу попадёте в кабинет клиента.",
  "Если код истёк, можно вернуться к анкете и повторить регистрацию."
];

const OWNER_HIGHLIGHTS = [
  "После подтверждения вы сразу попадёте в кабинет владельца.",
  "Дальше можно будет добавлять объекты и открывать расписание.",
  "Если код истёк, вернитесь к анкете и повторите шаг регистрации."
];
