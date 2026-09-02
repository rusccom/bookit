import { confirmAdminTwoFactorAction } from "@/features/admin/server/adminSecurityActions";
import { AdminCard } from "./shared/AdminCard";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";
import styles from "./adminSecurity.module.css";

export function AdminTwoFactorSetup({ secret, uri }: { secret: string; uri: string }) {
  return <AdminCard title="Подтвердите 2FA" description="Добавьте ключ в Google Authenticator, Microsoft Authenticator или другое TOTP-приложение.">
    <code className={styles.secret}>{secret}</code>
    <details><summary>Ссылка для ручного импорта</summary><code className={styles.uri}>{uri}</code></details>
    <AdminForm action={confirmAdminTwoFactorAction}>
      <AdminField label="Код подтверждения"><input autoComplete="one-time-code" inputMode="numeric" maxLength={6} name="token" pattern="[0-9]{6}" placeholder="123456" required /></AdminField>
      <AdminSubmitButton>Включить 2FA</AdminSubmitButton>
    </AdminForm>
  </AdminCard>;
}
