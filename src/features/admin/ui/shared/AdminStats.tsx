import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

type AdminStatsProps = { items: { label: string; value: ReactNode }[] };

export function AdminStats({ items }: AdminStatsProps) {
  return <div className={styles.stats}>{items.map(({ label, value }) =>
    <article className={`${styles.card} ${styles.stat}`} key={label}><span>{label}</span><strong>{value}</strong></article>
  )}</div>;
}
