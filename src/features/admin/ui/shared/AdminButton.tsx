import type { ComponentPropsWithoutRef } from "react";

import styles from "./adminUi.module.css";

export type AdminButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "regular" | "compact";
};

export function AdminButton({ variant = "primary", size = "regular", className = "", type = "button", ...props }: AdminButtonProps) {
  return <button {...props} className={`${styles.button} ${className}`} data-variant={variant} data-size={size} type={type} />;
}
