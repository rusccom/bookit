import type { Row } from "postgres";

import type { TelegramProfile } from "@/features/telegram/server/telegramTypes";
import { getDb } from "@/features/database/server/client";

type ProfileRow = Row & {
  chat_id: number;
  code_expires_at: string | null;
  pending_code_hash: string | null;
  pending_intent: Record<string, unknown>;
  pending_name: string | null;
  pending_phone: string | null;
  stage: TelegramProfile["stage"];
  user_id: string | null;
};

export async function getTelegramProfile(chatId: number) {
  const sql = getDb();
  const [row] = await sql<ProfileRow[]>`
    SELECT
      chat_id,
      user_id,
      stage,
      pending_name,
      pending_phone,
      pending_code_hash,
      code_expires_at,
      pending_intent
    FROM telegram_profiles
    WHERE chat_id = ${chatId}
  `;

  return row ? mapProfile(row) : null;
}

export async function ensureTelegramProfile(chatId: number) {
  const sql = getDb();
  await sql`
    INSERT INTO telegram_profiles (chat_id)
    VALUES (${chatId})
    ON CONFLICT (chat_id) DO NOTHING
  `;
  return getTelegramProfile(chatId);
}

export async function updateTelegramProfile(input: {
  chatId: number;
  patch: Partial<TelegramProfile>;
}) {
  const current = await getTelegramProfile(input.chatId);

  if (!current) {
    throw new Error("Telegram profile not found");
  }

  const next = {
    ...current,
    ...input.patch,
    pendingIntent: input.patch.pendingIntent ?? current.pendingIntent
  };
  const sql = getDb();
  await sql.unsafe(
    `
      UPDATE telegram_profiles
      SET
        user_id = $1,
        stage = $2,
        pending_name = $3,
        pending_phone = $4,
        pending_code_hash = $5,
        code_expires_at = $6,
        pending_intent = $7::jsonb,
        updated_at = NOW()
      WHERE chat_id = $8
    `,
    [
      next.userId,
      next.stage,
      next.pendingName,
      next.pendingPhone,
      next.pendingCodeHash,
      next.codeExpiresAt,
      JSON.stringify(next.pendingIntent),
      input.chatId
    ]
  );
}

export async function resetTelegramProfile(chatId: number) {
  const sql = getDb();
  await sql`
    UPDATE telegram_profiles
    SET
      user_id = NULL,
      stage = 'collect_name',
      pending_name = NULL,
      pending_phone = NULL,
      pending_code_hash = NULL,
      code_expires_at = NULL,
      pending_intent = '{}'::jsonb,
      updated_at = NOW()
    WHERE chat_id = ${chatId}
  `;
}

function mapProfile(row: ProfileRow): TelegramProfile {
  return {
    chatId: row.chat_id,
    codeExpiresAt: row.code_expires_at,
    pendingCodeHash: row.pending_code_hash,
    pendingIntent: row.pending_intent || {},
    pendingName: row.pending_name,
    pendingPhone: row.pending_phone,
    stage: row.stage,
    userId: row.user_id
  };
}
