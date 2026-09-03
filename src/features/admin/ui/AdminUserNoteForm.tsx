import { addAdminUserNoteAction } from "@/features/admin/server/adminUserNotesActions";
import { AdminField } from "./shared/AdminField";
import { AdminForm } from "./shared/AdminForm";
import { AdminSubmitButton } from "./shared/AdminSubmitButton";

export function AdminUserNoteForm({ userId }: { userId: string }) {
  return <AdminForm action={addAdminUserNoteAction}>
    <input name="userId" type="hidden" value={userId} />
    <AdminField label="Новая заметка"><textarea maxLength={1000} name="body" placeholder="Итог обращения или договорённость. Не сохраняйте пароли и платёжные данные." required rows={3} /></AdminField>
    <div><AdminSubmitButton>Добавить заметку</AdminSubmitButton></div>
  </AdminForm>;
}
