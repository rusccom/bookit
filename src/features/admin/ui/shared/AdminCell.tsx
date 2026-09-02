import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

export function AdminCell({ children, detail }: { children: ReactNode; detail?: ReactNode }) {
  return <div className={styles.cell}><div>{children}</div>{detail && <small>{detail}</small>}</div>;
}
