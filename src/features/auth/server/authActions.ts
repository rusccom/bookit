'use server';

import { redirect } from "next/navigation";

import { loginSchema, registrationSchema } from "@/features/auth/server/authSchema";
import {
  loginUser,
  prepareRegistration,
  registerPreparedUser,
  registerUser
} from "@/features/auth/server/authService";
import {
  clearPendingRegistration,
  readPendingRegistration,
  savePendingRegistration
} from "@/features/auth/server/pendingRegistration";
import { getDashboardPath } from "@/features/auth/server/requireUser";
import { createSession, clearSession } from "@/features/auth/server/session";
import { isSmsConfigured } from "@/features/shared/server/env";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "@/features/telegram/server/otp";
import { sendOtpSms } from "@/features/telegram/server/smsService";

export async function registerUserAction(formData: FormData) {
  const role = String(formData.get("role") || "customer");
  let target = `/register?role=${role}`;

  try {
    const values = registrationSchema.parse(getRegistrationValues(formData));

    if (!isSmsConfigured()) {
      await registerAndLogin(values);
      return;
    }

    const prepared = await prepareRegistration(values);
    const code = generateOtpCode();
    await sendOtpSms({
      code,
      phone: prepared.phone
    });
    await savePendingRegistration({
      ...prepared,
      codeHash: hashOtpCode(code)
    });
    target = `/register/verify?role=${prepared.role}&success=${encodeURIComponent("Код подтверждения отправлен по SMS.")}`;
  } catch (error) {
    target = `/register?role=${role}&error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

export async function confirmRegistrationAction(formData: FormData) {
  const pending = await readPendingRegistration();

  if (!pending) {
    redirect("/register?error=Сессия подтверждения истекла. Зарегистрируйтесь заново.");
  }

  const code = String(formData.get("code") || "").trim();

  if (!verifyOtpCode({ code, hash: pending.codeHash })) {
    redirect(
      `/register/verify?role=${pending.role}&error=${encodeURIComponent("Код неверный или истек.")}`
    );
  }

  try {
    const user = await registerPreparedUser({
      email: pending.email,
      fullName: pending.fullName,
      passwordHash: pending.passwordHash,
      phone: pending.phone,
      providerTitle: pending.providerTitle,
      role: pending.role
    });
    await clearPendingRegistration();
    await createSession(user);
    redirect(getDashboardPath(user.role));
  } catch (error) {
    await clearPendingRegistration();
    redirect(`/register?role=${pending.role}&error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function loginUserAction(formData: FormData) {
  let target = "/login";

  try {
    const values = loginSchema.parse(getLoginValues(formData));
    const user = await loginUser(values);
    await createSession(user);
    target = getDashboardPath(user.role);
  } catch (error) {
    target = `/login?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

export async function logoutUserAction() {
  await clearSession();
  redirect("/");
}

async function registerAndLogin(values: Parameters<typeof registerUser>[0]) {
  const user = await registerUser(values);
  await createSession(user);
  redirect(getDashboardPath(user.role));
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
