import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Кабинет",
  "Внутренние кабинеты клиентов и владельцев пространств."
);

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return props.children;
}
