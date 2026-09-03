import type { AdminAccount } from "@/features/admin/server/adminTypes";
import type { AdminUserNote } from "@/features/admin/server/adminUserNotesTypes";
import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";
import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";

type NoteRow = { id: string; author_login: string; body: string; created_at: Date };

export async function listAdminUserNotes(userId: string): Promise<AdminUserNote[]> {
  const sql = getDb();
  const rows = await sql<NoteRow[]>`
    SELECT id, author_login, body, created_at FROM admin_user_notes
    WHERE user_id = ${userId} ORDER BY created_at DESC, id DESC LIMIT 50
  `;
  return rows.map((row) => ({ id: row.id, authorLogin: row.author_login, body: row.body, createdAt: row.created_at.toISOString() }));
}

export async function insertAdminUserNote(input: { admin: AdminAccount; body: string; userId: string }) {
  const sql = getDb();
  const noteId = createId();
  await sql.begin(async (transaction) => {
    const rows = await transaction.unsafe<{ id: string }[]>(`
      INSERT INTO admin_user_notes(id, user_id, admin_user_id, author_login, body)
      SELECT $1, id, $3, $4, $5 FROM app_users WHERE id = $2 RETURNING id
    `, [noteId, input.userId, input.admin.id, input.admin.login, input.body]);
    if (!rows[0]) throw new Error("Пользователь не найден");
    await createAdminAudit({ admin: input.admin, action: "note:add", entityType: "user", entityId: input.userId, details: { noteId } }, transaction);
  });
  return noteId;
}
