import type { ReactNode } from "react";

import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import styles from "./adminUi.module.css";

type AdminPageProps = {
  title: string;
  eyebrow: string;
  description: ReactNode;
  children: ReactNode;
  error?: string;
  success?: string;
};

export function AdminPage({ title, eyebrow, description, children, error, success }: AdminPageProps) {
  return <section className={styles.page}>
    <StatusBanner error={error} success={success} />
    <header className={styles.pageHeader}><p>{eyebrow}</p><h1>{title}</h1><div>{description}</div></header>
    {children}
  </section>;
}
