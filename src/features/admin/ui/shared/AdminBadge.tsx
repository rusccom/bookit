import type { ReactNode } from "react";

import styles from "./adminUi.module.css";

export type AdminBadgeTone = "success" | "danger" | "warning" | "info" | "neutral";
type AdminBadgeProps = { children: ReactNode; tone?: AdminBadgeTone };

export function AdminBadge({ children, tone = "neutral" }: AdminBadgeProps) {
  return <span className={styles.badge} data-tone={tone}>{children}</span>;
}
