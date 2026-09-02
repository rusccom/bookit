import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

import styles from "./adminUi.module.css";

type AdminLinkProps = ComponentPropsWithoutRef<"a"> & { href: string; download?: boolean; button?: boolean };

export function AdminLink({ button, download, className = "", ...props }: AdminLinkProps) {
  const appearance = `${button ? styles.button : styles.link} ${className}`;
  if (download) return <a {...props} className={appearance} download />;
  return <Link {...props} className={appearance} data-variant="secondary" data-size="compact" />;
}
