import type { Row } from "postgres";

import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";

type SessionRow = Row & {
  admin_user_id: string;
  created_at: Date;
  expires_at: Date;
  id: string;
  last_seen_at: Date;
  user_agent: string;
};

export async function createAdminSessionRecord(input: {
  adminId: string;
  expiresAt: Date;
  userAgent: string;
}) {
  const sql = getDb();
  const id = createId();
  await sql`
    INSERT INTO admin_sessions (id, admin_user_id, expires_at, user_agent)
    VALUES (${id}, ${input.adminId}, ${input.expiresAt}, ${input.userAgent})
  `;
  return id;
}

export async function findActiveAdminSession(id: string) {
  const sql = getDb();
  const [row] = await sql<SessionRow[]>`
    SELECT id, admin_user_id, user_agent, created_at, last_seen_at, expires_at
    FROM admin_sessions
    WHERE id = ${id} AND revoked_at IS NULL AND expires_at > NOW()
  `;
  return row || null;
}

export async function touchAdminSession(id: string) {
  const sql = getDb();
  await sql`
    UPDATE admin_sessions SET last_seen_at = NOW()
    WHERE id = ${id} AND last_seen_at < NOW() - INTERVAL '5 minutes'
  `;
}

export async function revokeAdminSessionById(id: string) {
  const sql = getDb();
  await sql`
    UPDATE admin_sessions SET revoked_at = NOW()
    WHERE id = ${id} AND revoked_at IS NULL
  `;
}

export async function revokeOwnedAdminSession(input: {
  adminId: string;
  sessionId: string;
}) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    UPDATE admin_sessions SET revoked_at = NOW()
    WHERE id = ${input.sessionId} AND admin_user_id = ${input.adminId}
    RETURNING id
  `;
  return Boolean(rows[0]);
}

export async function listAdminSessions(adminId: string) {
  const sql = getDb();
  return sql<SessionRow[]>`
    SELECT id, admin_user_id, user_agent, created_at, last_seen_at, expires_at
    FROM admin_sessions
    WHERE admin_user_id = ${adminId} AND revoked_at IS NULL AND expires_at > NOW()
    ORDER BY last_seen_at DESC
  `;
}

export async function revokeOtherAdminSessions(input: {
  adminId: string;
  currentSessionId: string;
}) {
  const sql = getDb();
  await sql`
    UPDATE admin_sessions SET revoked_at = NOW()
    WHERE admin_user_id = ${input.adminId} AND id != ${input.currentSessionId}
      AND revoked_at IS NULL
  `;
}
