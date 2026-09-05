'use server';

import { redirect } from "next/navigation";

import { loginSchema, registrationSchema } from "@/features/auth/server/authSchema";
import { getRegisterPath } from "@/features/auth/server/registrationPaths";
import { getDashboardPath } from "@/features/auth/server/requireUser";
import { createSession, clearSession } from "@/features/auth/server/session";
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
import { isSmsConfigured } from "@/features/shared/server/env";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "@/features/shared/server/otp";
import { sendOtpSms } from "@/features/shared/server/smsService";
import { getErrorMessage, isUniqueConstraintError } from "@/features/shared/server/errors";
import { readFormText } from "@/features/shared/server/formData";

export async function registerUserAction(formData: FormData) {
  const role = readRole(formData);
  let target = getRegisterPath(role);
  try {
    target = await beginRegistration(formData);
  } catch (error) {
    target = `${getRegisterPath(role)}?error=${encodeURIComponent(getRegistrationError(error))}`;
  }
  redirect(target);
}

export async function confirmRegistrationAction(formData: FormData) {
  const pending = await readPendingRegistration();
  if (!pending) redirect("/register?error=Сессия подтверждения истекла. Зарегистрируйтесь заново.");
  const code = readFormText(formData, "code").trim();
  if (!verifyOtpCode({ code, hash: pending.codeHash })) redirect(`/register/verify?role=${pending.role}&error=${encodeURIComponent("Код неверный или уже истёк.")}`);
  let target: string;
  try {
    target = await completePendingRegistration(pending);
  } catch (error) {
    await clearPendingRegistration();
    target = `${getRegisterPath(pending.role)}?error=${encodeURIComponent(getRegistrationError(error))}`;
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
    target = `/login?error=${encodeURIComponent(getErrorMessage(error, "Не удалось войти"))}`;
  }

  redirect(target);
}

export async function logoutUserAction() {
  await clearSession();
  redirect("/");
}

function readRole(formData: FormData) {
  return readFormText(formData, "role") || "customer";
}

function getRegistrationValues(formData: FormData) {
  return {
    email: readFormText(formData, "email"),
    fullName: readFormText(formData, "fullName"),
    password: readFormText(formData, "password"),
    phone: readFormText(formData, "phone"),
    providerTitle: readFormText(formData, "providerTitle"),
    role: readRole(formData)
  };
}

function getLoginValues(formData: FormData) {
  return {
    email: readFormText(formData, "email"),
    password: readFormText(formData, "password")
  };
}

async function beginRegistration(formData: FormData) {
  const values = registrationSchema.parse(getRegistrationValues(formData));
  if (!isSmsConfigured()) {
    const user = await registerUser(values);
    await createSession(user);
    return getDashboardPath(user.role);
  }
  const prepared = await prepareRegistration(values);
  const code = generateOtpCode();
  await sendOtpSms({ code, phone: prepared.phone });
  await savePendingRegistration({ ...prepared, codeHash: hashOtpCode(code) });
  return `/register/verify?role=${prepared.role}&success=${encodeURIComponent("Код подтверждения отправлен по SMS.")}`;
}

async function completePendingRegistration(pending: NonNullable<Awaited<ReturnType<typeof readPendingRegistration>>>) {
  const user = await registerPreparedUser(pending);
  await clearPendingRegistration();
  await createSession(user);
  return getDashboardPath(user.role);
}

function getRegistrationError(error: unknown) {
  if (isUniqueConstraintError(error)) return "Email или телефон уже используется";
  return getErrorMessage(error, "Проверьте введённые данные");
}
