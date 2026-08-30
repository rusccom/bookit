'use server';

import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession
} from "@/features/admin/server/adminSession";
import {
  authenticateAdmin,
  changeUserBlocked,
  removeUser,
  updateUser
} from "@/features/admin/server/adminService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";

export async function loginAdminAction(formData: FormData) {
  let target = "/admin";
  try {
    const admin = await authenticateAdmin(readCredentials(formData));
    await createAdminSession(admin, formData.get("remember") === "on");
    target = "/adminpanel";
  } catch (error) {
    const message = encodeURIComponent(getMessage(error));
    target = `/admin?error=${message}`;
  }
  redirect(target);
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const search = String(formData.get("search") || "");
  let status = `success=${encodeURIComponent("Пользователь удалён")}`;
  try {
    await removeUser(admin, String(formData.get("userId") || ""));
  } catch (error) {
    status = `error=${encodeURIComponent(getMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

export async function updateUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const search = String(formData.get("search") || "");
  let status = `success=${encodeURIComponent("Данные пользователя обновлены")}`;
  try {
    await updateUser(admin, readUserUpdate(formData));
  } catch (error) {
    status = `error=${encodeURIComponent(getMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

export async function blockUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const search = String(formData.get("search") || "");
  const blocked = formData.get("blocked") === "true";
  let status = `success=${encodeURIComponent(blocked ? "Пользователь заблокирован" : "Пользователь разблокирован")}`;
  try {
    await changeUserBlocked(admin, String(formData.get("userId") || ""), blocked);
  } catch (error) {
    status = `error=${encodeURIComponent(getMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

function readCredentials(formData: FormData) {
  return {
    login: String(formData.get("login") || ""),
    otp: String(formData.get("otp") || ""),
    password: String(formData.get("password") || "")
  };
}

function readUserUpdate(formData: FormData) {
  return {
    email: String(formData.get("email") || ""),
    fullName: String(formData.get("fullName") || ""),
    phone: String(formData.get("phone") || ""),
    userId: String(formData.get("userId") || "")
  };
}

function getMessage(error: unknown) {
  if (isUniqueConflict(error)) return "Email или телефон уже используется";
  return error instanceof Error ? error.message : "Неожиданная ошибка";
}

function isUniqueConflict(error: unknown) {
  return typeof error === "object" && error !== null
    && "code" in error && error.code === "23505";
}
