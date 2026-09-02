import { beginAdminTwoFactorAction, disableAdminTwoFactorAction } from "@/features/admin/server/adminSecurityActions";
import { AdminTwoFactorSetup } from "./AdminTwoFactorSetup";
import { AdminCard } from "./shared/AdminCard";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";

type AdminTwoFactorPanelProps = { enabled: boolean; setup: { secret: string; uri: string } | null };

export function AdminTwoFactorPanel({ enabled, setup }: AdminTwoFactorPanelProps) {
  if (enabled) return <AdminCard title="Двухфакторная защита" description="Включена. При входе требуется шестизначный код.">
    <AdminForm action={disableAdminTwoFactorAction}>
      <AdminField label="Текущий пароль"><input autoComplete="current-password" name="password" required type="password" /></AdminField>
      <AdminSubmitButton variant="danger">Отключить 2FA</AdminSubmitButton>
    </AdminForm>
  </AdminCard>;
  if (setup) return <AdminTwoFactorSetup {...setup} />;
  return <AdminCard title="Двухфакторная защита" description="Подключите приложение-аутентификатор для защиты административного аккаунта.">
    <AdminForm action={beginAdminTwoFactorAction}><AdminSubmitButton>Настроить 2FA</AdminSubmitButton></AdminForm>
  </AdminCard>;
}
