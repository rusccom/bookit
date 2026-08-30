import { z } from "zod";

import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import { findAdminByLogin } from "@/features/admin/server/adminRepository";
import {
  createAdminAccount,
  deleteAdminAccount,
  enableAdminTwoFactor,
  listManagedAdmins,
  saveAdminTwoFactorSecret,
  updateAdminPassword
} from "@/features/admin/server/adminSecurityRepository";
import {
  listAdminSessions,
  revokeOtherAdminSessions,
  revokeOwnedAdminSession
} from "@/features/admin/server/adminSessionRepository";
import { readAdminSession } from "@/features/admin/server/adminSession";
import type {
  AdminAccount,
  AdminSecurityData
} from "@/features/admin/server/adminTypes";
import {
  createOtpAuthUri,
  createTotpSecret,
  decryptTotpSecret,
  encryptTotpSecret,
  verifyTotp
} from "@/features/admin/server/adminTwoFactor";
import { hashPassword, verifyPassword } from "@/features/auth/server/password";

const adminIdSchema = z.string().uuid();
const credentialsSchema = z.object({
  login: z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,32}$/, "Логин: 3–32 латинских символа"),
  password: z.string().min(10, "Пароль должен содержать минимум 10 символов").max(100)
});
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Укажите текущий пароль"),
  newPassword: z.string().min(10, "Новый пароль должен содержать минимум 10 символов").max(100)
});

export async function getAdminSecurityData(admin: AdminAccount): Promise<AdminSecurityData> {
  const session = await readAdminSession();
  const candidate = await findAdminByLogin(admin.login);
  if (!session || !candidate) throw new Error("Сессия администратора не найдена");
  const [admins, rows] = await Promise.all([listManagedAdmins(), listAdminSessions(admin.id)]);
  return {
    admins,
    currentAdminId: admin.id,
    sessions: rows.map((row) => ({ createdAt: row.created_at.toISOString(), expiresAt: row.expires_at.toISOString(), id: row.id, isCurrent: row.id === session.sessionId, lastSeenAt: row.last_seen_at.toISOString(), userAgent: row.user_agent })),
    twoFactorEnabled: candidate.twoFactorEnabled,
    twoFactorSetup: readTwoFactorSetup(admin.login, candidate)
  };
}

export async function addAdmin(admin: AdminAccount, input: { login: string; password: string }) {
  const values = parseCredentials(input);
  const id = await createAdminAccount({ login: values.login, passwordHash: await hashPassword(values.password) });
  await createAdminAudit({ action: "create", admin, details: { login: values.login }, entityId: id, entityType: "admin" });
}

export async function removeAdmin(admin: AdminAccount, adminId: string) {
  const id = adminIdSchema.parse(adminId);
  if (id === admin.id) throw new Error("Нельзя удалить собственный аккаунт");
  if (!await deleteAdminAccount(id)) throw new Error("Администратор не найден");
  await createAdminAudit({ action: "delete", admin, entityId: id, entityType: "admin" });
}

export async function changeOwnAdminPassword(admin: AdminAccount, input: { currentPassword: string; newPassword: string }) {
  const values = parsePasswordChange(input);
  const candidate = await findAdminByLogin(admin.login);
  if (!candidate || !await verifyPassword({ hash: candidate.passwordHash, password: values.currentPassword })) throw new Error("Текущий пароль неверен");
  await updateAdminPassword({ adminId: admin.id, passwordHash: await hashPassword(values.newPassword) });
  const session = await readAdminSession();
  if (session) await revokeOtherAdminSessions({ adminId: admin.id, currentSessionId: session.sessionId });
  await createAdminAudit({ action: "password", admin, entityId: admin.id, entityType: "admin" });
}

export async function beginAdminTwoFactor(admin: AdminAccount) {
  const candidate = await findAdminByLogin(admin.login);
  if (candidate?.twoFactorEnabled) throw new Error("Сначала отключите действующую 2FA с подтверждением пароля");
  const secret = createTotpSecret();
  await saveAdminTwoFactorSecret({ adminId: admin.id, encryptedSecret: encryptTotpSecret(secret) });
  await createAdminAudit({ action: "2fa:setup", admin, entityId: admin.id, entityType: "admin" });
}

export async function confirmAdminTwoFactor(admin: AdminAccount, token: string) {
  const candidate = await findAdminByLogin(admin.login);
  const secret = candidate?.twoFactorSecret && decryptTotpSecret(candidate.twoFactorSecret);
  if (!secret || !verifyTotp(secret, token.trim())) throw new Error("Неверный одноразовый код");
  await enableAdminTwoFactor(admin.id);
  await createAdminAudit({ action: "2fa:enable", admin, entityId: admin.id, entityType: "admin" });
}

export async function disableAdminTwoFactor(admin: AdminAccount, password: string) {
  const candidate = await findAdminByLogin(admin.login);
  if (!candidate || !await verifyPassword({ hash: candidate.passwordHash, password })) throw new Error("Пароль неверен");
  await saveAdminTwoFactorSecret({ adminId: admin.id, encryptedSecret: null });
  await createAdminAudit({ action: "2fa:disable", admin, entityId: admin.id, entityType: "admin" });
}

export async function revokeAdminDevice(admin: AdminAccount, sessionId: string) {
  const id = adminIdSchema.parse(sessionId);
  const session = await readAdminSession();
  if (session?.sessionId === id) throw new Error("Текущую сессию завершите кнопкой «Выйти»");
  if (!await revokeOwnedAdminSession({ adminId: admin.id, sessionId: id })) throw new Error("Сессия не найдена");
  await createAdminAudit({ action: "revoke", admin, entityId: id, entityType: "session" });
}

function readTwoFactorSetup(login: string, candidate: NonNullable<Awaited<ReturnType<typeof findAdminByLogin>>>) {
  if (candidate.twoFactorEnabled || !candidate.twoFactorSecret) return null;
  const secret = decryptTotpSecret(candidate.twoFactorSecret);
  return { secret, uri: createOtpAuthUri(login, secret) };
}

function parseCredentials(input: z.input<typeof credentialsSchema>) {
  const result = credentialsSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);
  return result.data;
}

function parsePasswordChange(input: z.input<typeof passwordChangeSchema>) {
  const result = passwordChangeSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);
  return result.data;
}
