import type { Row } from "postgres";

import type { AuthUser, UserRole } from "@/features/auth/server/authTypes";
import { getDb } from "@/features/database/server/client";
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
};

export async function findUserByEmail(email: string) {
  const sql = getDb();
  const [row] = await sql<DbUserRow[]>`
    SELECT id, role, full_name, email, phone
    FROM app_users
    WHERE email = ${email}
  `;

  return row ? mapUser(row) : null;
}

export async function findUserById(id: string) {
  const sql = getDb();
  const [row] = await sql<DbUserRow[]>`
    SELECT id, role, full_name, email, phone
    FROM app_users
    WHERE id = ${id}
  `;

  return row ? mapUser(row) : null;
}

export async function findUserByPhone(phone: string) {
  const sql = getDb();
  const [row] = await sql<DbUserRow[]>`
    SELECT id, role, full_name, email, phone
    FROM app_users
    WHERE phone = ${phone}
  `;

  return row ? mapUser(row) : null;
}

export async function findUserWithPassword(email: string) {
  const sql = getDb();
  const [row] = await sql<
    (DbUserRow & {
      password_hash: string | null;
    })[]
  >`
    SELECT id, role, full_name, email, phone, password_hash
    FROM app_users
    WHERE email = ${email}
  `;

  if (!row) {
    return null;
  }

  return {
    passwordHash: row.password_hash,
    user: mapUser(row)
  };
}

export async function createUser(input: UserInsert) {
  const sql = getDb();
  const userId = createId();
  const [row] = await sql<DbUserRow[]>`
    INSERT INTO app_users (
      id,
      role,
      full_name,
      email,
      phone,
      password_hash
    ) VALUES (
      ${userId},
      ${input.role},
      ${input.fullName},
      ${input.email},
      ${input.phone},
      ${input.passwordHash}
    )
    RETURNING id, role, full_name, email, phone
  `;

  return mapUser(row);
}

export async function createProvider(input: ProviderInsert) {
  const sql = getDb();
  await sql`
    INSERT INTO providers (
      id,
      owner_user_id,
      title
    ) VALUES (
      ${createId()},
      ${input.ownerUserId},
      ${input.title}
    )
  `;
}

export async function upsertTelegramCustomer(input: {
  fullName: string;
  phone: string;
}) {
  const sql = getDb();
  const [row] = await sql<DbUserRow[]>`
    INSERT INTO app_users (
      id,
      role,
      full_name,
      phone
    ) VALUES (
      ${createId()},
      'customer',
      ${input.fullName},
      ${input.phone}
    )
    ON CONFLICT (phone) DO UPDATE
    SET full_name = EXCLUDED.full_name
    RETURNING id, role, full_name, email, phone
  `;

  return mapUser(row);
}

function mapUser(row: DbUserRow): AuthUser {
  return {
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    phone: row.phone,
    role: row.role
  };
}
