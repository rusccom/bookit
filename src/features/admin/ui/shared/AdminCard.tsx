import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

type AdminCardProps = { title?: string; description?: ReactNode; children: ReactNode };

export function AdminCard({ title, description, children }: AdminCardProps) {
  return <section className={styles.card}>
    {title && <h2>{title}</h2>}
    {description && <p>{description}</p>}
    {children}
  </section>;
}
