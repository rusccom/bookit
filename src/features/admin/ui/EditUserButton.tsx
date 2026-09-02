import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { updateUserAction } from "@/features/admin/server/adminActions";
import { BelarusPhoneInput } from "@/features/shared/ui/BelarusPhoneInput";
import { getAdminRoleLabel } from "./adminPresentation";
import { AdminBadge } from "./shared/AdminBadge";
import { AdminEditDialog } from "./shared/AdminEditDialog";
import { AdminField } from "./shared/AdminField";

type EditUserButtonProps = { search: string; user: AdminUserRecord };

export function EditUserButton({ search, user }: EditUserButtonProps) {
  return <AdminEditDialog eyebrow="Пользователь" title="Изменить данные" action={updateUserAction} values={{ userId: user.id, search }}>
    <AdminField label="Имя"><input defaultValue={user.fullName} maxLength={100} minLength={2} name="fullName" required /></AdminField>
    <AdminField label="Email"><input defaultValue={user.email || ""} name="email" type="email" /></AdminField>
    <AdminField label="Телефон"><BelarusPhoneInput defaultValue={user.phone} /></AdminField>
    <AdminBadge tone="info">{getAdminRoleLabel(user.role)}</AdminBadge>
  </AdminEditDialog>;
}
