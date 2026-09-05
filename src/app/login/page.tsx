import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { ModernAuthLayout } from "@/features/auth/ui/ModernAuthLayout";
import { ModernLoginForm } from "@/features/auth/ui/ModernLoginForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

export const metadata: Metadata = createNoIndexMetadata(
  "Вход",
  "Вход в личный кабинет BookCort."
);

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = getSearchParam(searchParams.error);

  return (
    <ModernAuthLayout>
      <StatusBanner error={error} />
      <ModernLoginForm />
    </ModernAuthLayout>
  );
}
