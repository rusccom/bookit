import Link from "next/link";

import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import type { UserRole } from "@/features/auth/server/authTypes";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const role = resolveRole(searchParams.role);
  const error = pickValue(searchParams.error);

  return (
    <div className="auth-layout">
      <section className="panel intro-panel">
        <p className="eyebrow">Registration</p>
        <h1>{role === "owner" ? "Регистрация арендодателя" : "Регистрация клиента"}</h1>
        <p className="lead">
          {role === "owner"
            ? "Создайте кабинет, чтобы добавлять корты, задавать часы работы и вручную блокировать слоты."
            : "Создайте аккаунт, чтобы искать доступность, бронировать корты и получать доступ к Telegram-боту."}
        </p>
        <div className="role-links">
          <Link className={role === "customer" ? "chip chip-active" : "chip"} href="/register?role=customer">
            Клиент
          </Link>
          <Link className={role === "owner" ? "chip chip-active" : "chip"} href="/register?role=owner">
            Арендодатель
          </Link>
        </div>
      </section>
      <div className="stack">
        <StatusBanner error={error} />
        <RegisterForm role={role} />
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
