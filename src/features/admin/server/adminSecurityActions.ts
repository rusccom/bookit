"use server";

import { redirect } from "next/navigation";

import {
  addAdmin,
  beginAdminTwoFactor,
  changeOwnAdminPassword,
  confirmAdminTwoFactor,
  disableAdminTwoFactor,
  removeAdmin,
  revokeAdminDevice
} from "@/features/admin/server/adminSecurityService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { getErrorMessage, isUniqueConstraintError } from "@/features/shared/server/errors";
import { readFormText } from "@/features/shared/server/formData";

export async function addAdminAction(formData: FormData) {
  await runSecurityAction("Администратор добавлен", (admin) => addAdmin(admin, { login: readFormText(formData, "login"), password: readFormText(formData, "password") }));
}

export async function removeAdminAction(formData: FormData) {
  await runSecurityAction("Администратор удалён", (admin) => removeAdmin(admin, readFormText(formData, "adminId")));
}

export async function changeAdminPasswordAction(formData: FormData) {
  await runSecurityAction("Пароль изменён, остальные сессии завершены", (admin) => changeOwnAdminPassword(admin, { currentPassword: readFormText(formData, "currentPassword"), newPassword: readFormText(formData, "newPassword") }));
}

export async function beginAdminTwoFactorAction() {
  await runSecurityAction("Ключ создан. Подтвердите код из приложения", beginAdminTwoFactor);
}

export async function confirmAdminTwoFactorAction(formData: FormData) {
  await runSecurityAction("Двухфакторная защита включена", (admin) => confirmAdminTwoFactor(admin, readFormText(formData, "token")));
}

export async function disableAdminTwoFactorAction(formData: FormData) {
  await runSecurityAction("Двухфакторная защита отключена", (admin) => disableAdminTwoFactor(admin, readFormText(formData, "password")));
}

export async function revokeAdminSessionAction(formData: FormData) {
  await runSecurityAction("Сессия завершена", (admin) => revokeAdminDevice(admin, readFormText(formData, "sessionId")));
}

async function runSecurityAction(success: string, operation: (admin: Awaited<ReturnType<typeof requireAdmin>>) => Promise<void>) {
  const admin = await requireAdmin();
  const params = new URLSearchParams();
  try {
    await operation(admin);
    params.set("success", success);
  } catch (error) {
    params.set("error", getSecurityErrorMessage(error));
  }
  redirect(`/adminpanel/admins?${params}`);
}

function getSecurityErrorMessage(error: unknown) {
  if (isUniqueConstraintError(error)) return "Такой логин уже используется";
  return getErrorMessage(error, "Не удалось выполнить действие");
}
