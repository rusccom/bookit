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
  "Один и тот же визуальный язык, что и на главной: пользователь не теряет контекст при входе.",
  "Форма ведёт прямо к действию и не перегружает экран второстепенными блоками.",
  "После логина маршрут продолжится уже в отдельном дизайне личного кабинета."
];

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout
      description="Возвращайтесь в Bookit без лишних шагов. Вход собран как чистая публичная точка входа в продукт."
      eyebrow="Логин"
      highlights={HIGHLIGHTS}
      title="Ваши брони и площадки уже внутри."
    >
      <StatusBanner error={error} />
      <ModernLoginForm />
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
