import { addAdminAction } from "@/features/admin/server/adminSecurityActions";
import { AdminCard } from "./shared/AdminCard";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";

export function AdminCreateForm() {
  return <AdminCard title="Добавить администратора" description="Используйте отдельный логин и пароль не короче 10 символов.">
    <AdminForm action={addAdminAction}>
      <AdminField label="Логин"><input autoComplete="off" maxLength={32} minLength={3} name="login" pattern="[a-z0-9._-]{3,32}" required /></AdminField>
      <AdminField label="Пароль"><input autoComplete="new-password" minLength={10} name="password" required type="password" /></AdminField>
      <AdminSubmitButton>Добавить</AdminSubmitButton>
    </AdminForm>
  </AdminCard>;
}
