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
import { getErrorMessage, isUniqueConstraintError } from "@/features/shared/server/errors";
import { readFormFlag, readFormText } from "@/features/shared/server/formData";

export async function loginAdminAction(formData: FormData) {
  let target = "/admin";
  try {
    const admin = await authenticateAdmin(readCredentials(formData));
    await createAdminSession(admin, readFormText(formData, "remember") === "on");
    target = "/adminpanel";
  } catch (error) {
    const message = encodeURIComponent(getAdminErrorMessage(error));
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
  const search = readFormText(formData, "search");
  let status = `success=${encodeURIComponent("Пользователь удалён")}`;
  try {
    await removeUser(admin, readFormText(formData, "userId"));
  } catch (error) {
    status = `error=${encodeURIComponent(getAdminErrorMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

export async function updateUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const search = readFormText(formData, "search");
  let status = `success=${encodeURIComponent("Данные пользователя обновлены")}`;
  try {
    await updateUser(admin, readUserUpdate(formData));
  } catch (error) {
    status = `error=${encodeURIComponent(getAdminErrorMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

export async function blockUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const search = readFormText(formData, "search");
  const blocked = readFormFlag(formData, "blocked");
  let status = `success=${encodeURIComponent(blocked ? "Пользователь заблокирован" : "Пользователь разблокирован")}`;
  try {
    await changeUserBlocked(admin, readFormText(formData, "userId"), blocked);
  } catch (error) {
    status = `error=${encodeURIComponent(getAdminErrorMessage(error))}`;
  }
  redirect(`/adminpanel/users?q=${encodeURIComponent(search)}&${status}`);
}

function readCredentials(formData: FormData) {
  return {
    login: readFormText(formData, "login"),
    otp: readFormText(formData, "otp"),
    password: readFormText(formData, "password")
  };
}

function readUserUpdate(formData: FormData) {
  return {
    email: readFormText(formData, "email"),
    fullName: readFormText(formData, "fullName"),
    phone: readFormText(formData, "phone"),
    userId: readFormText(formData, "userId")
  };
}

function getAdminErrorMessage(error: unknown) {
  if (isUniqueConstraintError(error)) return "Email или телефон уже используется";
  return getErrorMessage(error, "Неожиданная ошибка");
}
