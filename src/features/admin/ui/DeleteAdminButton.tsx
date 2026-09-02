import { removeAdminAction } from "@/features/admin/server/adminSecurityActions";
import { AdminActionForm } from "./shared/AdminActionForm";

export function DeleteAdminButton({ adminId }: { adminId: string }) {
  return <AdminActionForm action={removeAdminAction} values={{ adminId }} variant="danger"
    confirmation="Удалить администратора и завершить все его сессии?">
    Удалить
  </AdminActionForm>;
}
