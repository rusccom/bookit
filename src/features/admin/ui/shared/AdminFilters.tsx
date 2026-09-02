import type { ReactNode } from "react";

import { AdminButton } from "./AdminButton";
import { AdminField } from "./AdminField";
import styles from "./adminUi.module.css";

type AdminFiltersProps = { search: string; placeholder: string; children?: ReactNode };

export function AdminFilters({ search, placeholder, children }: AdminFiltersProps) {
  return <form className={styles.filters} method="get">
    <div className={styles.search}><AdminField label="Поиск"><input defaultValue={search} name="q" placeholder={placeholder} type="search" /></AdminField></div>
    {children}
    <AdminButton type="submit">{children ? "Применить" : "Найти"}</AdminButton>
  </form>;
}
