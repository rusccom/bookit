import type { Row } from "postgres";

import type { AuthUser, UserRole } from "@/features/auth/server/authTypes";
import { getDb } from "@/features/database/server/client";
import type { DbExecutor } from "@/features/database/server/types";
import { createId } from "@/features/shared/server/id";

type UserInsert = {
  email: string;
  fullName: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
};

type ProviderInsert = {
  ownerUserId: string;
  title: string;
};

type DbUserRow = Row & {
  email: string | null;
  full_name: string;
  id: string;
  phone: string | null;
  role: UserRole;
  is_blocked: boolean;
};

type AccountInsert = UserInsert & { providerTitle?: string };
type PasswordUserRow = DbUserRow & { password_hash: string | null };

const USER_SELECT = "SELECT id, role, full_name, email, phone, is_blocked FROM app_users";

export async function findUserByEmail(email: string) {
  return findUserBy("email", email);
}

export async function findUserById(id: string) {
  return findUserBy("id", id);
}

export async function findUserByPhone(phone: string) {
  return findUserBy("phone", phone);
}

export async function findUserWithPassword(email: string) {
  const sql = getDb();
  const [row] = await sql<PasswordUserRow[]>`
    SELECT id, role, full_name, email, phone, password_hash, is_blocked
    FROM app_users
    WHERE email = ${email}
  `;
  return row ? { passwordHash: row.password_hash, user: mapAuthUser(row) } : null;
}

export async function createUserAccount(input: AccountInsert) {
  return getDb().begin(async (sql) => {
    const user = await insertUser(sql, input);
    if (input.role === "owner") await insertProvider(sql, {
      ownerUserId: user.id, title: input.providerTitle || `${input.fullName} Booking`
    });
    return user;
  });
}

async function insertUser(sql: DbExecutor, input: UserInsert) {
  const userId = createId();
  const [row] = await sql.unsafe<DbUserRow[]>(`
    INSERT INTO app_users (
      id, role, full_name, email, phone, password_hash
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, role, full_name, email, phone, is_blocked
  `, [userId, input.role, input.fullName, input.email, input.phone, input.passwordHash]);
  return mapAuthUser(row);
}

async function insertProvider(sql: DbExecutor, input: ProviderInsert) {
  await sql.unsafe(`
    INSERT INTO providers (id, owner_user_id, title) VALUES ($1, $2, $3)
  `, [createId(), input.ownerUserId, input.title]);
}

export async function upsertTelegramCustomer(input: {
  fullName: string;
  phone: string;
}) {
  const sql = getDb();
  const [row] = await sql<DbUserRow[]>`
    INSERT INTO app_users (id, role, full_name, phone)
    VALUES (${createId()}, 'customer', ${input.fullName}, ${input.phone})
    ON CONFLICT (phone) DO UPDATE
    SET full_name = EXCLUDED.full_name
    RETURNING id, role, full_name, email, phone, is_blocked
  `;

  return mapAuthUser(row);
}

function mapAuthUser(row: DbUserRow): AuthUser {
  return {
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    phone: row.phone,
    role: row.role,
    isBlocked: row.is_blocked
  };
}

async function findUserBy(column: "email" | "id" | "phone", value: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<DbUserRow[]>(`${USER_SELECT} WHERE ${column} = $1`, [value]);
  return row ? mapAuthUser(row) : null;
}
