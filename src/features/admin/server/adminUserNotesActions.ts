"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { addAdminUserNote } from "@/features/admin/server/adminUserNotesService";

export async function addAdminUserNoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") || "");
  if (!z.string().uuid().safeParse(userId).success) redirect("/adminpanel/users?error=Пользователь%20не%20найден");
  const params = new URLSearchParams();
  try {
    await addAdminUserNote(admin, { userId, body: String(formData.get("body") || "") });
    params.set("success", "Внутренняя заметка добавлена");
  } catch (error) {
    params.set("error", error instanceof Error ? error.message : "Не удалось добавить заметку");
  }
  redirect(`/adminpanel/users/${userId}?${params}#notes`);
}
