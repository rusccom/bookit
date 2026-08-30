import { addAdminAction } from "@/features/admin/server/adminSecurityActions";

import styles from "./adminSecurity.module.css";

export function AdminCreateForm() {
  return <section className={styles.card}><h2>Добавить администратора</h2><p>Используйте отдельный логин и пароль не короче 10 символов.</p><form action={addAdminAction} className={styles.form}><label><span>Логин</span><input autoComplete="off" maxLength={32} minLength={3} name="login" pattern="[a-z0-9._-]{3,32}" required /></label><label><span>Пароль</span><input autoComplete="new-password" minLength={10} name="password" required type="password" /></label><button type="submit">Добавить</button></form></section>;
}
