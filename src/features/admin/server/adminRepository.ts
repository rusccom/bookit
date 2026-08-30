import type { Row } from "postgres";

import type {
  AdminAccount,
  AdminUserRecord
} from "@/features/admin/server/adminTypes";
import type { UserRole } from "@/features/auth/server/authTypes";
import { getDb } from "@/features/database/server/client";

type AdminRow = Row & {
  id: string;
  login: string;
  password_hash: string;
};

type UserRow = Row & {
  created_at: Date;
  email: string | null;
  full_name: string;
  id: string;
  phone: string | null;
  role: UserRole;
};

const FIND_ADMIN_BY_LOGIN = `
  SELECT id, login, password_hash
  FROM admin_users
  WHERE login = $1
`;

const FIND_ADMIN_BY_ID = `
  SELECT id, login, password_hash
  FROM admin_users
  WHERE id = $1
`;

const LIST_USERS = `
  SELECT id, role, full_name, email, phone, created_at
  FROM app_users
  WHERE $1 = ''
    OR full_name ILIKE $2
    OR COALESCE(email, '') ILIKE $2
    OR COALESCE(phone, '') ILIKE $2
  ORDER BY created_at DESC
`;

export async function findAdminByLogin(login: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<AdminRow[]>(FIND_ADMIN_BY_LOGIN, [login]);
  return row ? mapAdminWithPassword(row) : null;
}

export async function findAdminById(id: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<AdminRow[]>(FIND_ADMIN_BY_ID, [id]);
  return row ? mapAdmin(row) : null;
}

export async function listUsers(search: string) {
  const sql = getDb();
  const normalized = search.trim();
  const rows = await sql.unsafe<UserRow[]>(LIST_USERS, [
    normalized,
    `%${normalized}%`
  ]);
  return rows.map(mapUser);
}

export async function deleteUserById(id: string) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM app_users
    WHERE id = ${id}
    RETURNING id
  `;
  return Boolean(rows[0]);
}

function mapAdmin(row: AdminRow): AdminAccount {
  return { id: row.id, login: row.login };
}

function mapAdminWithPassword(row: AdminRow) {
  return {
    admin: mapAdmin(row),
    passwordHash: row.password_hash
  };
}

function mapUser(row: UserRow): AdminUserRecord {
  return {
    createdAt: row.created_at.toISOString(),
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    phone: row.phone,
    role: row.role
  };
}
