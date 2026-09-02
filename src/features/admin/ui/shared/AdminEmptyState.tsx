import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return <div className={styles.empty}>{children}</div>;
}
