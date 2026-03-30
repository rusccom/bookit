import Link from "next/link";

import type { UserRole } from "@/features/auth/server/authTypes";
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
    <div className="auth-layout">
      <section className="panel intro-panel">
        <p className="eyebrow">Verification</p>
        <h1>{role === "owner" ? "Подтверждение владельца" : "Подтверждение клиента"}</h1>
        <p className="lead">
          Введите код из SMS, чтобы завершить регистрацию и сразу попасть в кабинет.
        </p>
        <Link className="secondary-link" href={`/register?role=${role}`}>
          Вернуться к регистрации
        </Link>
      </section>
      <div className="stack">
        <StatusBanner error={error} success={success} />
        <RegisterVerificationForm />
      </div>
    </div>
  );
}

function resolveRole(value: string | string[] | undefined): UserRole {
  return pickValue(value) === "owner" ? "owner" : "customer";
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
