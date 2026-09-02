import { changeAdminPasswordAction } from "@/features/admin/server/adminSecurityActions";
import { AdminCard } from "./shared/AdminCard";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";

export function AdminPasswordForm() {
  return <AdminCard title="Сменить мой пароль" description="После смены пароля остальные устройства будут отключены.">
    <AdminForm action={changeAdminPasswordAction}>
      <AdminField label="Текущий пароль"><input autoComplete="current-password" name="currentPassword" required type="password" /></AdminField>
      <AdminField label="Новый пароль"><input autoComplete="new-password" minLength={10} name="newPassword" required type="password" /></AdminField>
      <AdminSubmitButton>Изменить пароль</AdminSubmitButton>
    </AdminForm>
  </AdminCard>;
}
