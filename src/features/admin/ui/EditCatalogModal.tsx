"use client";

import { updateAdminCatalogAction } from "@/features/admin/server/adminCatalogActions";
import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";

import styles from "./editUserModal.module.css";

type EditCatalogModalProps = { city: string; item: AdminCatalogRecord; onClose: () => void; search: string; status: string };

export function EditCatalogModal(props: EditCatalogModalProps) {
  const { item } = props;
  return <div className={styles.overlay} role="presentation"><section aria-labelledby="edit-catalog-title" aria-modal="true" className={styles.modal} role="dialog"><header className={styles.header}><div><span>Каталог</span><h2 id="edit-catalog-title">Изменить объект</h2></div><button aria-label="Закрыть" className={styles.closeButton} onClick={props.onClose} type="button">×</button></header><form action={updateAdminCatalogAction} className={styles.form}>
    <input name="unitId" type="hidden" value={item.unitId} /><input name="venueId" type="hidden" value={item.venueId} /><input name="search" type="hidden" value={props.search} /><input name="filterCity" type="hidden" value={props.city} /><input name="filterStatus" type="hidden" value={props.status} />
    <label className={styles.field}><span>Название объекта</span><input defaultValue={item.venueTitle} maxLength={100} name="venueTitle" required /></label><label className={styles.field}><span>Город</span><input defaultValue={item.city} maxLength={100} name="city" required /></label><label className={styles.field}><span>Адрес</span><input defaultValue={item.address} maxLength={200} name="address" required /></label><label className={styles.field}><span>Название корта</span><input defaultValue={item.unitTitle} maxLength={100} name="unitTitle" required /></label>
    <footer className={styles.actions}><button className={styles.cancelButton} onClick={props.onClose} type="button">Отмена</button><button className={styles.saveButton} type="submit">Сохранить</button></footer>
  </form></section></div>;
}
