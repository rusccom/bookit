'use server';

import { redirect } from "next/navigation";

import { loginSchema, registrationSchema } from "@/features/auth/server/authSchema";
import { getDashboardPath } from "@/features/auth/server/requireUser";
import { createSession, clearSession } from "@/features/auth/server/session";
import { loginUser, registerUser } from "@/features/auth/server/authService";

export async function registerUserAction(formData: FormData) {
  let target = `/register?role=${String(formData.get("role") || "customer")}`;

  try {
    const values = registrationSchema.parse(getRegistrationValues(formData));
    const user = await registerUser(values);
    await createSession(user);
    target = getDashboardPath(user.role);
  } catch (error) {
    const message = getErrorMessage(error);
    const role = String(formData.get("role") || "customer");
    target = `/register?role=${role}&error=${encodeURIComponent(message)}`;
  }

  redirect(target);
}

export async function loginUserAction(formData: FormData) {
  let target = "/login";

  try {
    const values = loginSchema.parse(getLoginValues(formData));
    const user = await loginUser(values);
    await createSession(user);
    target = getDashboardPath(user.role);
  } catch (error) {
    const message = getErrorMessage(error);
    target = `/login?error=${encodeURIComponent(message)}`;
  }

  redirect(target);
}

export async function logoutUserAction() {
  await clearSession();
  redirect("/");
}

function getRegistrationValues(formData: FormData) {
  return {
    email: String(formData.get("email") || ""),
    fullName: String(formData.get("fullName") || ""),
    password: String(formData.get("password") || ""),
    phone: String(formData.get("phone") || ""),
    providerTitle: String(formData.get("providerTitle") || ""),
    role: String(formData.get("role") || "customer")
  };
}

function getLoginValues(formData: FormData) {
  return {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || "")
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error";
}
