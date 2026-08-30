'use server';

import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession
} from "@/features/admin/server/adminSession";
import {
  authenticateAdmin,
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
  } catch {
    const message = encodeURIComponent("Неверный логин или пароль");
    target = `/admin?error=${message}`;
  }
  redirect(target);
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function deleteUserAction(formData: FormData) {
  await requireAdmin();
  const search = String(formData.get("search") || "");
  let status = `success=${encodeURIComponent("Пользователь удалён")}`;
  try {
    await removeUser(String(formData.get("userId") || ""));
  } catch (error) {
    status = `error=${encodeURIComponent(getMessage(error))}`;
  }
  redirect(`/adminpanel?q=${encodeURIComponent(search)}&${status}`);
}

export async function updateUserAction(formData: FormData) {
  await requireAdmin();
  const search = String(formData.get("search") || "");
  let status = `success=${encodeURIComponent("Данные пользователя обновлены")}`;
  try {
    await updateUser(readUserUpdate(formData));
  } catch (error) {
    status = `error=${encodeURIComponent(getMessage(error))}`;
  }
  redirect(`/adminpanel?q=${encodeURIComponent(search)}&${status}`);
}

function readCredentials(formData: FormData) {
  return {
    login: String(formData.get("login") || ""),
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
