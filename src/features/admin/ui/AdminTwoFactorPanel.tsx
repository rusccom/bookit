import {
  beginAdminTwoFactorAction,
  confirmAdminTwoFactorAction,
  disableAdminTwoFactorAction
} from "@/features/admin/server/adminSecurityActions";

import styles from "./adminSecurity.module.css";

type AdminTwoFactorPanelProps = { enabled: boolean; setup: { secret: string; uri: string } | null };

export function AdminTwoFactorPanel(props: AdminTwoFactorPanelProps) {
  if (props.enabled) return <section className={styles.card}><h2>Двухфакторная защита</h2><p className={styles.secureText}>Включена. При входе требуется шестизначный код.</p><form action={disableAdminTwoFactorAction} className={styles.inlineForm}><input name="password" placeholder="Текущий пароль" required type="password" /><button className={styles.dangerButton} type="submit">Отключить 2FA</button></form></section>;
  if (!props.setup) return <section className={styles.card}><h2>Двухфакторная защита</h2><p>Подключите приложение-аутентификатор для защиты административного аккаунта.</p><form action={beginAdminTwoFactorAction}><button type="submit">Настроить 2FA</button></form></section>;
  return <section className={styles.card}><h2>Подтвердите 2FA</h2><p>Добавьте ключ в Google Authenticator, Microsoft Authenticator или другое TOTP-приложение.</p><code className={styles.secret}>{props.setup.secret}</code><details><summary>Ссылка для ручного импорта</summary><code className={styles.uri}>{props.setup.uri}</code></details><form action={confirmAdminTwoFactorAction} className={styles.inlineForm}><input autoComplete="one-time-code" inputMode="numeric" maxLength={6} name="token" pattern="[0-9]{6}" placeholder="Код 123456" required /><button type="submit">Включить 2FA</button></form></section>;
}
