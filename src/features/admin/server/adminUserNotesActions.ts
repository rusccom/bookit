"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { addAdminUserNote } from "@/features/admin/server/adminUserNotesService";
import { getErrorMessage } from "@/features/shared/server/errors";
import { readFormText } from "@/features/shared/server/formData";

export async function addAdminUserNoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = readFormText(formData, "userId");
  if (!z.string().uuid().safeParse(userId).success) redirect("/adminpanel/users?error=Пользователь%20не%20найден");
  const params = new URLSearchParams();
  try {
    await addAdminUserNote(admin, { userId, body: readFormText(formData, "body") });
    params.set("success", "Внутренняя заметка добавлена");
  } catch (error) {
    params.set("error", getErrorMessage(error, "Не удалось добавить заметку"));
  }
  redirect(`/adminpanel/users/${userId}?${params}#notes`);
}
