import { z } from "zod";

import {
  deleteUserById,
  findAdminByLogin,
  listUsers,
  updateUserById
} from "@/features/admin/server/adminRepository";
import { verifyPassword } from "@/features/auth/server/password";
import { isPhoneValid, normalizePhone } from "@/features/shared/server/phone";

const credentialsSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().min(1)
});

const userIdSchema = z.string().uuid();

const userUpdateSchema = z.object({
  email: z.string().trim().email("Укажите корректный email").or(z.literal("")),
  fullName: z.string().trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя не должно быть длиннее 100 символов"),
  phone: z.string().trim().transform(normalizePhone).refine(
    (value) => !value || isPhoneValid(value),
    "Укажите корректный телефон"
  ),
  userId: userIdSchema
});

export async function authenticateAdmin(input: {
  login: string;
  password: string;
}) {
  const values = credentialsSchema.parse(input);
  const candidate = await findAdminByLogin(values.login.toLowerCase());
  const valid = candidate && await verifyPassword({
    hash: candidate.passwordHash,
    password: values.password
  });
  if (!candidate || !valid) throw new Error("Неверный логин или пароль");
  return candidate.admin;
}

export async function getAdminUsers(search: string) {
  return listUsers(search);
}

export async function removeUser(userId: string) {
  const deleted = await deleteUserById(userIdSchema.parse(userId));
  if (!deleted) throw new Error("Пользователь уже удалён");
}

export async function updateUser(input: z.input<typeof userUpdateSchema>) {
  const result = userUpdateSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);
  const values = result.data;
  const updated = await updateUserById({
    email: values.email.toLowerCase() || null,
    fullName: values.fullName,
    id: values.userId,
    phone: values.phone || null
  });
  if (!updated) throw new Error("Пользователь не найден");
}
