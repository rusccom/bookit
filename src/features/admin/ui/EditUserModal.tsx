"use client";

import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { updateUserAction } from "@/features/admin/server/adminActions";
import { BelarusPhoneInput } from "@/features/shared/ui/BelarusPhoneInput";

import styles from "./editUserModal.module.css";

type EditUserModalProps = {
  onClose: () => void;
  search: string;
  user: AdminUserRecord;
};

export function EditUserModal({ onClose, search, user }: EditUserModalProps) {
  return <div className={styles.overlay} role="presentation">
    <section aria-labelledby="edit-user-title" aria-modal="true" className={styles.modal} role="dialog">
      <header className={styles.header}><div><span>Пользователь</span><h2 id="edit-user-title">Изменить данные</h2></div><button aria-label="Закрыть" className={styles.closeButton} onClick={onClose} type="button">×</button></header>
      <form action={updateUserAction} className={styles.form}>
        <input name="userId" type="hidden" value={user.id} /><input name="search" type="hidden" value={search} />
        <label className={styles.field}><span>Имя</span><input defaultValue={user.fullName} maxLength={100} minLength={2} name="fullName" required /></label>
        <label className={styles.field}><span>Email</span><input defaultValue={user.email || ""} name="email" type="email" /></label>
        <label className={styles.field}><span>Телефон</span><BelarusPhoneInput defaultValue={user.phone} /></label>
        <p className={styles.roleNote}>Роль: <strong>{user.role === "owner" ? "Владелец" : "Клиент"}</strong></p>
        <footer className={styles.actions}><button className={styles.cancelButton} onClick={onClose} type="button">Отмена</button><button className={styles.saveButton} type="submit">Сохранить</button></footer>
      </form>
    </section>
  </div>;
}
