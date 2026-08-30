import type { Row } from "postgres";

import type { ManagedAdmin } from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";

type ManagedAdminRow = Row & {
  created_at: Date;
  id: string;
  locked_until: Date | null;
  login: string;
  two_factor_enabled: boolean;
};

export async function recordAdminLoginFailure(adminId: string) {
  const sql = getDb();
  await sql`
    UPDATE admin_users
    SET failed_login_count = failed_login_count + 1,
        locked_until = CASE WHEN failed_login_count >= 4
          THEN NOW() + INTERVAL '15 minutes' ELSE locked_until END,
        updated_at = NOW()
    WHERE id = ${adminId}
  `;
}

export async function resetAdminLoginState(adminId: string) {
  const sql = getDb();
  await sql`
    UPDATE admin_users
    SET failed_login_count = 0, locked_until = NULL, updated_at = NOW()
    WHERE id = ${adminId}
  `;
}

export async function listManagedAdmins(): Promise<ManagedAdmin[]> {
  const sql = getDb();
  const rows = await sql<ManagedAdminRow[]>`
    SELECT id, login, created_at, locked_until, two_factor_enabled
    FROM admin_users ORDER BY created_at
  `;
  return rows.map(mapManagedAdmin);
}

export async function createAdminAccount(input: {
  login: string;
  passwordHash: string;
}) {
  const sql = getDb();
  const id = createId();
  await sql`
    INSERT INTO admin_users (id, login, password_hash)
    VALUES (${id}, ${input.login}, ${input.passwordHash})
  `;
  return id;
}

export async function updateAdminPassword(input: {
  adminId: string;
  passwordHash: string;
}) {
  const sql = getDb();
  await sql`
    UPDATE admin_users SET password_hash = ${input.passwordHash}, updated_at = NOW()
    WHERE id = ${input.adminId}
  `;
}

export async function deleteAdminAccount(adminId: string) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM admin_users WHERE id = ${adminId} RETURNING id
  `;
  return Boolean(rows[0]);
}

export async function saveAdminTwoFactorSecret(input: {
  adminId: string;
  encryptedSecret: string | null;
}) {
  const sql = getDb();
  await sql`
    UPDATE admin_users
    SET two_factor_secret = ${input.encryptedSecret},
        two_factor_enabled = FALSE, updated_at = NOW()
    WHERE id = ${input.adminId}
  `;
}

export async function enableAdminTwoFactor(adminId: string) {
  const sql = getDb();
  await sql`
    UPDATE admin_users SET two_factor_enabled = TRUE, updated_at = NOW()
    WHERE id = ${adminId} AND two_factor_secret IS NOT NULL
  `;
}

function mapManagedAdmin(row: ManagedAdminRow): ManagedAdmin {
  return {
    createdAt: row.created_at.toISOString(),
    id: row.id,
    isLocked: Boolean(row.locked_until && row.locked_until > new Date()),
    login: row.login,
    twoFactorEnabled: row.two_factor_enabled
  };
}
