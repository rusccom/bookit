import type { Row } from "postgres";

import type {
  AdminAccount,
  AdminUserRecord
} from "@/features/admin/server/adminTypes";
import type { UserRole } from "@/features/auth/server/authTypes";
import { getDb } from "@/features/database/server/client";

type AdminRow = Row & {
  failed_login_count: number;
  id: string;
  login: string;
  locked_until: Date | null;
  password_hash: string;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
};

type UserRow = Row & {
  created_at: Date;
  email: string | null;
  full_name: string;
  id: string;
  is_blocked: boolean;
  phone: string | null;
  role: UserRole;
  bookings_count: string;
  units_count: string;
};

type UserUpdate = {
  email: string | null;
  fullName: string;
  id: string;
  phone: string | null;
};

const FIND_ADMIN_BY_LOGIN = `
  SELECT id, login, password_hash, failed_login_count, locked_until,
         two_factor_enabled, two_factor_secret
  FROM admin_users
  WHERE login = $1
`;

const FIND_ADMIN_BY_ID = `
  SELECT id, login, password_hash, failed_login_count, locked_until,
         two_factor_enabled, two_factor_secret
  FROM admin_users
  WHERE id = $1
`;

const LIST_USERS = `
  SELECT a.id, a.role, a.full_name, a.email, a.phone, a.created_at,
         a.is_blocked, COUNT(DISTINCT b.id)::TEXT AS bookings_count,
         COUNT(DISTINCT u.id)::TEXT AS units_count
  FROM app_users a
  LEFT JOIN providers p ON p.owner_user_id = a.id
  LEFT JOIN venues v ON v.provider_id = p.id
  LEFT JOIN bookable_units u ON u.venue_id = v.id
  LEFT JOIN bookings b ON a.role = 'customer' AND b.customer_user_id = a.id
  WHERE $1 = ''
    OR a.full_name ILIKE $2
    OR COALESCE(a.email, '') ILIKE $2
    OR COALESCE(a.phone, '') ILIKE $2
    OR ($3 != '' AND regexp_replace(COALESCE(a.phone, ''), '\\D', '', 'g') ILIKE $3)
  GROUP BY a.id
  ORDER BY a.created_at DESC
`;

const FIND_USER = `
  SELECT a.id, a.role, a.full_name, a.email, a.phone, a.created_at,
         a.is_blocked,
         (SELECT COUNT(*) FROM bookings b
          WHERE a.role = 'customer' AND b.customer_user_id = a.id)::TEXT AS bookings_count,
         (SELECT COUNT(*) FROM bookable_units u
          JOIN venues v ON v.id = u.venue_id
          JOIN providers p ON p.id = v.provider_id
          WHERE p.owner_user_id = a.id)::TEXT AS units_count
  FROM app_users a
  WHERE a.id = $1
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
  const phoneQuery = normalized.replace(/\D/g, "");
  const rows = await sql.unsafe<UserRow[]>(LIST_USERS, [
    normalized,
    `%${normalized}%`,
    phoneQuery ? `%${phoneQuery}%` : ""
  ]);
  return rows.map(mapUser);
}

export async function findUserForAdmin(id: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<UserRow[]>(FIND_USER, [id]);
  return row ? mapUser(row) : null;
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

export async function updateUserById(input: UserUpdate) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    UPDATE app_users
    SET full_name = ${input.fullName},
        email = ${input.email},
        phone = ${input.phone}
    WHERE id = ${input.id}
    RETURNING id
  `;
  return Boolean(rows[0]);
}

export async function setUserBlocked(input: {
  adminId: string;
  blocked: boolean;
  userId: string;
}) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    UPDATE app_users
    SET is_blocked = ${input.blocked},
        blocked_at = ${input.blocked ? new Date() : null},
        blocked_by_admin_id = ${input.blocked ? input.adminId : null}
    WHERE id = ${input.userId}
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
    failedLoginCount: row.failed_login_count,
    lockedUntil: row.locked_until,
    passwordHash: row.password_hash,
    twoFactorEnabled: row.two_factor_enabled,
    twoFactorSecret: row.two_factor_secret
  };
}

function mapUser(row: UserRow): AdminUserRecord {
  return {
    bookingsCount: Number(row.bookings_count),
    createdAt: row.created_at.toISOString(),
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    isBlocked: row.is_blocked,
    phone: row.phone,
    role: row.role,
    unitsCount: Number(row.units_count)
  };
}
