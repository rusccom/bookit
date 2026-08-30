import type { AdminUserCatalogItem } from "@/features/admin/server/adminTypes";

import styles from "./adminUserDetails.module.css";

type AdminUserCatalogListProps = {
  catalog: AdminUserCatalogItem[];
};

export function AdminUserCatalogList({ catalog }: AdminUserCatalogListProps) {
  if (!catalog.length) return <p className={styles.empty}>У пользователя нет кортов.</p>;
  return <div className={styles.catalogGrid}>{catalog.map((item) => <article className={styles.catalogCard} key={item.unitId}><div><strong>{item.unitTitle}</strong><span>{item.venueTitle}, {item.city}</span></div><b className={item.isActive ? styles.active : styles.inactive}>{item.isActive ? "Активен" : "Отключён"}</b></article>)}</div>;
}
