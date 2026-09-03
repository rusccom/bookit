import { z } from "zod";

import {
  deleteUserById,
  findAdminByLogin,
  findUserForAdmin,
  listUsers,
  setUserBlocked,
  updateUserById
} from "@/features/admin/server/adminRepository";
import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { listAdminUserNotes } from "@/features/admin/server/adminUserNotesRepository";
import {
  listUserAdminBookings,
  listUserAdminCatalog
} from "@/features/admin/server/adminUserDetailsRepository";
import {
  recordAdminLoginFailure,
  resetAdminLoginState
} from "@/features/admin/server/adminSecurityRepository";
import {
  decryptTotpSecret,
  verifyTotp
} from "@/features/admin/server/adminTwoFactor";
import { verifyPassword } from "@/features/auth/server/password";
import {
  isBelarusPhoneValid,
  normalizeBelarusPhone
} from "@/features/shared/server/phone";

const credentialsSchema = z.object({
  login: z.string().trim().min(1),
  otp: z.string().trim().optional(),
  password: z.string().min(1)
});

const userIdSchema = z.string().uuid();

const userUpdateSchema = z.object({
  email: z.string().trim().email("Укажите корректный email").or(z.literal("")),
  fullName: z.string().trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя не должно быть длиннее 100 символов"),
  phone: z.string().trim().transform(normalizeBelarusPhone).refine(
    (value) => !value || isBelarusPhoneValid(value),
    "Телефон: +375 XX XXX XX XX, код 25, 29, 33 или 44"
  ),
  userId: userIdSchema
});

export async function authenticateAdmin(input: {
  login: string;
  otp?: string;
  password: string;
}) {
  const values = credentialsSchema.parse(input);
  const candidate = await findAdminByLogin(values.login.toLowerCase());
  if (!candidate) throw new Error("Неверный логин или пароль");
  await assertAdminUnlocked(candidate);
  await assertAdminPassword(candidate, values.password);
  await assertAdminOtp(candidate, values.otp || "");
  await resetAdminLoginState(candidate.admin.id);
  return candidate.admin;
}

export async function getAdminUsers(search: string) {
  return listUsers(search);
}

export async function removeUser(admin: AdminAccount, userId: string) {
  const deleted = await deleteUserById(userIdSchema.parse(userId));
  if (!deleted) throw new Error("Пользователь уже удалён");
  await createAdminAudit({ action: "delete", admin, entityId: userId, entityType: "user" });
}

export async function updateUser(
  admin: AdminAccount,
  input: z.input<typeof userUpdateSchema>
) {
  const result = userUpdateSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);
  const values = result.data;
  const updated = await updateUserById(toUserUpdate(values));
  if (!updated) throw new Error("Пользователь не найден");
  await auditUserUpdate(admin, values);
}

function toUserUpdate(values: z.output<typeof userUpdateSchema>) {
  return {
    email: values.email.toLowerCase() || null,
    fullName: values.fullName,
    id: values.userId,
    phone: values.phone || null
  };
}

async function auditUserUpdate(admin: AdminAccount, values: z.output<typeof userUpdateSchema>) {
  await createAdminAudit({
    action: "update",
    admin,
    details: { email: values.email, fullName: values.fullName, phone: values.phone },
    entityId: values.userId,
    entityType: "user"
  });
}

export async function changeUserBlocked(
  admin: AdminAccount,
  userId: string,
  blocked: boolean
) {
  const id = userIdSchema.parse(userId);
  const changed = await setUserBlocked({ adminId: admin.id, blocked, userId: id });
  if (!changed) throw new Error("Пользователь не найден");
  await createAdminAudit({ action: blocked ? "block" : "unblock", admin, entityId: id, entityType: "user" });
}

export async function getAdminUserDetails(userId: string) {
  const parsed = userIdSchema.safeParse(userId);
  if (!parsed.success) return null;
  const id = parsed.data;
  const user = await findUserForAdmin(id);
  if (!user) return null;
  const [bookings, catalog, notes] = await Promise.all([
    user.role === "customer" ? listUserAdminBookings(id) : Promise.resolve([]),
    user.role === "owner" ? listUserAdminCatalog(id) : Promise.resolve([]),
    listAdminUserNotes(id)
  ]);
  return { bookings, catalog, notes, user };
}

type AdminCandidate = NonNullable<Awaited<ReturnType<typeof findAdminByLogin>>>;

async function assertAdminUnlocked(candidate: AdminCandidate) {
  if (candidate.lockedUntil && candidate.lockedUntil > new Date()) {
    throw new Error("Вход временно заблокирован. Повторите через 15 минут");
  }
  if (candidate.lockedUntil) await resetAdminLoginState(candidate.admin.id);
}

async function assertAdminPassword(candidate: AdminCandidate, password: string) {
  const valid = await verifyPassword({ hash: candidate.passwordHash, password });
  if (valid) return;
  await recordAdminLoginFailure(candidate.admin.id);
  throw new Error("Неверный логин или пароль");
}

async function assertAdminOtp(candidate: AdminCandidate, otp: string) {
  if (!candidate.twoFactorEnabled) return;
  const secret = decryptTotpSecret(candidate.twoFactorSecret || "");
  if (verifyTotp(secret, otp)) return;
  await recordAdminLoginFailure(candidate.admin.id);
  throw new Error("Неверный одноразовый код");
}
