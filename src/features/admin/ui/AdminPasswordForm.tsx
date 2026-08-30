import { changeAdminPasswordAction } from "@/features/admin/server/adminSecurityActions";

import styles from "./adminSecurity.module.css";

export function AdminPasswordForm() {
  return <section className={styles.card}><h2>Сменить мой пароль</h2><p>После смены пароля остальные устройства будут отключены.</p><form action={changeAdminPasswordAction} className={styles.form}><label><span>Текущий пароль</span><input autoComplete="current-password" name="currentPassword" required type="password" /></label><label><span>Новый пароль</span><input autoComplete="new-password" minLength={10} name="newPassword" required type="password" /></label><button type="submit">Изменить пароль</button></form></section>;
}
