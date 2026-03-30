import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";
import { SiteHeader } from "@/features/app/ui/SiteHeader";

export const metadata: Metadata = createNoIndexMetadata(
  "Кабинет",
  "Внутренние кабинеты клиентов и владельцев пространств."
);

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page-content">{props.children}</main>
    </div>
  );
}
