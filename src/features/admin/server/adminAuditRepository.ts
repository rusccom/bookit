import type { Row } from "postgres";

import type {
  AdminAccount,
  AdminAuditRecord
} from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";

type AuditRow = Row & {
  action: string;
  admin_login: string;
  created_at: Date;
  details: Record<string, string | number | boolean | null>;
  entity_id: string;
  entity_type: string;
  id: string;
};

export async function createAdminAudit(input: {
  action: string;
  admin: AdminAccount;
  details?: Record<string, string | number | boolean | null>;
  entityId: string;
  entityType: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO admin_audit_log (
      id, admin_user_id, admin_login, action, entity_type, entity_id, details
    ) VALUES (
      ${createId()}, ${input.admin.id}, ${input.admin.login}, ${input.action},
      ${input.entityType}, ${input.entityId}, ${sql.json(input.details || {})}
    )
  `;
}

export async function listAdminAudit(search: string): Promise<AdminAuditRecord[]> {
  const sql = getDb();
  const query = search.trim();
  const rows = await sql<AuditRow[]>`
    SELECT id, admin_login, action, entity_type, entity_id, details, created_at
    FROM admin_audit_log
    WHERE ${query} = '' OR admin_login ILIKE ${`%${query}%`}
      OR action ILIKE ${`%${query}%`} OR entity_type ILIKE ${`%${query}%`}
      OR entity_id ILIKE ${`%${query}%`}
    ORDER BY created_at DESC LIMIT 200
  `;
  return rows.map(mapAudit);
}

function mapAudit(row: AuditRow): AdminAuditRecord {
  return {
    action: row.action,
    adminLogin: row.admin_login,
    createdAt: row.created_at.toISOString(),
    details: row.details,
    entityId: row.entity_id,
    entityType: row.entity_type,
    id: row.id
  };
}
