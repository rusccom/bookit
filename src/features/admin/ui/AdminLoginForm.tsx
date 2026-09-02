import { loginAdminAction } from "@/features/admin/server/adminActions";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { AdminCheckbox } from "./shared/AdminCheckbox";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";
import styles from "./adminLogin.module.css";

export function AdminLoginForm({ error }: { error?: string }) {
  return <section className={styles.loginCard}>
    <div className={styles.loginHeader}>
      <span className={styles.adminMark}>A</span><p className={styles.eyebrow}>Закрытая зона</p>
      <h1>Вход администратора</h1><p>Введите административные учётные данные для продолжения.</p>
    </div>
    <StatusBanner error={error} />
    <AdminForm action={loginAdminAction}>
      <AdminField label="Логин"><input autoComplete="username" name="login" required /></AdminField>
      <AdminField label="Пароль"><input autoComplete="current-password" name="password" required type="password" /></AdminField>
      <AdminField label="Код 2FA, если включён"><input autoComplete="one-time-code" inputMode="numeric" maxLength={6} name="otp" pattern="[0-9]{6}" placeholder="123456" /></AdminField>
      <AdminCheckbox name="remember" label="Запомнить мой вход на 30 дней" />
      <AdminSubmitButton>Войти</AdminSubmitButton>
    </AdminForm>
  </section>;
}
