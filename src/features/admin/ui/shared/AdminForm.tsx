import type { ComponentPropsWithoutRef } from "react";

import styles from "./adminUi.module.css";

export function AdminForm({ className = "", ...props }: ComponentPropsWithoutRef<"form">) {
  return <form {...props} className={`${styles.form} ${className}`} />;
}
