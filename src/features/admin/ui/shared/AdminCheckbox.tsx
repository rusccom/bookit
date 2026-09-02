import type { ComponentPropsWithoutRef } from "react";

import styles from "./adminUi.module.css";

type AdminCheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & { label: string };

export function AdminCheckbox({ label, ...props }: AdminCheckboxProps) {
  return <label className={styles.checkbox}><input {...props} type="checkbox" /><span>{label}</span></label>;
}
