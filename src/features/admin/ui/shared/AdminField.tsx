import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

type AdminFieldProps = { label: string; children: ReactNode };

export function AdminField({ label, children }: AdminFieldProps) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}
