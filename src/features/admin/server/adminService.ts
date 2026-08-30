import { z } from "zod";

import {
  deleteUserById,
  findAdminByLogin,
  listUsers
} from "@/features/admin/server/adminRepository";
import { verifyPassword } from "@/features/auth/server/password";

const credentialsSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().min(1)
});

const userIdSchema = z.string().uuid();

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
