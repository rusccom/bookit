import { z } from "zod";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { insertAdminUserNote } from "@/features/admin/server/adminUserNotesRepository";
import { parseWithMessage } from "@/features/shared/server/validation";

const noteSchema = z.object({
  userId: z.string().uuid("Пользователь не найден"),
  body: z.string().trim().min(1, "Введите текст заметки").max(1000, "Максимум 1000 символов")
});

export async function addAdminUserNote(admin: AdminAccount, input: z.input<typeof noteSchema>) {
  const note = parseWithMessage(noteSchema, input, "Проверьте заметку");
  return insertAdminUserNote({ ...note, admin });
}
