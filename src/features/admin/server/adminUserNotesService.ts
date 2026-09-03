import { z } from "zod";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { insertAdminUserNote } from "@/features/admin/server/adminUserNotesRepository";

const noteSchema = z.object({
  userId: z.string().uuid("Пользователь не найден"),
  body: z.string().trim().min(1, "Введите текст заметки").max(1000, "Максимум 1000 символов")
});

export async function addAdminUserNote(admin: AdminAccount, input: z.input<typeof noteSchema>) {
  const result = noteSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || "Проверьте заметку");
  return insertAdminUserNote({ ...result.data, admin });
}
