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

export async function addAdminAction(formData: FormData) {
  await runSecurityAction("Администратор добавлен", (admin) => addAdmin(admin, { login: read(formData, "login"), password: read(formData, "password") }));
}

export async function removeAdminAction(formData: FormData) {
  await runSecurityAction("Администратор удалён", (admin) => removeAdmin(admin, read(formData, "adminId")));
}

export async function changeAdminPasswordAction(formData: FormData) {
  await runSecurityAction("Пароль изменён, остальные сессии завершены", (admin) => changeOwnAdminPassword(admin, { currentPassword: read(formData, "currentPassword"), newPassword: read(formData, "newPassword") }));
}

export async function beginAdminTwoFactorAction() {
  await runSecurityAction("Ключ создан. Подтвердите код из приложения", beginAdminTwoFactor);
}

export async function confirmAdminTwoFactorAction(formData: FormData) {
  await runSecurityAction("Двухфакторная защита включена", (admin) => confirmAdminTwoFactor(admin, read(formData, "token")));
}

export async function disableAdminTwoFactorAction(formData: FormData) {
  await runSecurityAction("Двухфакторная защита отключена", (admin) => disableAdminTwoFactor(admin, read(formData, "password")));
}

export async function revokeAdminSessionAction(formData: FormData) {
  await runSecurityAction("Сессия завершена", (admin) => revokeAdminDevice(admin, read(formData, "sessionId")));
}

async function runSecurityAction(success: string, operation: (admin: Awaited<ReturnType<typeof requireAdmin>>) => Promise<void>) {
  const admin = await requireAdmin();
  const params = new URLSearchParams();
  try {
    await operation(admin);
    params.set("success", success);
  } catch (error) {
    params.set("error", getMessage(error));
  }
  redirect(`/adminpanel/admins?${params}`);
}

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

function getMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error && error.code === "23505") return "Такой логин уже используется";
  return error instanceof Error ? error.message : "Не удалось выполнить действие";
}
