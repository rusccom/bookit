import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

export function AdminActions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}
