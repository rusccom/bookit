import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = createNoIndexMetadata(
  "Регистрация",
  "Регистрация гостей и владельцев площадок в Bookit."
);

export default async function RegisterLayout(props: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardPath(user.role));
  return props.children;
}
