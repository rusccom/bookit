import Link from "next/link";

import type { UserRole } from "@/features/auth/server/authTypes";
import { getRegisterPath } from "@/features/auth/server/registrationPaths";
import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { RegisterVerificationForm } from "@/features/auth/ui/RegisterVerificationForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

import styles from "@/features/auth/ui/auth.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterVerifyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const role = resolveRole(searchParams.role);
  const error = pickValue(searchParams.error);
  const success = pickValue(searchParams.success);

  return (
    <ModernAuthLayout
      description="Введите код из SMS, чтобы завершить регистрацию."
      eyebrow="Подтверждение"
      highlights={getHighlights(role)}
      title={role === "owner" ? "Подтвердите аккаунт арендодателя" : "Подтвердите аккаунт клиента"}
    >
      <StatusBanner error={error} success={success} />
      <RegisterVerificationForm />
      <p className={styles.footer}>
        <Link className={styles.link} href={getRegisterPath(role)}>
          Вернуться к анкете
        </Link>
      </p>
    </ModernAuthLayout>
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
  "Код нужен для завершения регистрации и защиты аккаунта",
  "После подтверждения — сразу в личный кабинет",
  "Если код истёк, вернитесь к анкете и повторите"
];

const OWNER_HIGHLIGHTS = [
  "После подтверждения — сразу в панель управления",
  "Далее можно добавлять объекты и расписание",
  "Если код истёк, вернитесь к анкете и повторите"
];
