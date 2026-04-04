import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernLoginForm } from "@/features/auth/ui/ModernLoginForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

export const metadata: Metadata = createNoIndexMetadata(
  "Вход",
  "Вход в личный кабинет BookCort."
);

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <ModernAuthLayout>
      <StatusBanner error={error} />
      <ModernLoginForm />
    </ModernAuthLayout>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
