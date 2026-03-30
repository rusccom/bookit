import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";
import type {
  CreateBookingInput,
  DbExecutor
} from "@/features/booking/server/bookingRepositoryTypes";

export async function createBooking(input: CreateBookingInput) {
  const sql = input.sql || getDb();
  const [row] = await sql.unsafe<{ id: string }[]>(
    `
      INSERT INTO bookings (
        id,
        unit_id,
        customer_user_id,
        created_by_user_id,
        source,
        status,
        note,
        telegram_chat_id,
        booking_date,
        start_minutes,
        end_minutes,
        expires_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING id
    `,
    [
      createId(),
      input.unitId,
      input.customerUserId || null,
      input.createdByUserId || null,
      input.source,
      input.status,
      input.note || "",
      input.telegramChatId || null,
      input.bookingDate,
      input.startMinutes,
      input.endMinutes,
      input.expiresAt || null
    ]
  );

  return row.id;
}

export async function updateBookingStatus(input: {
  bookingId: string;
  sql?: DbExecutor;
  status: string;
}) {
  const sql = input.sql || getDb();
  await sql.unsafe(
    `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
    `,
    [input.status, input.bookingId]
  );
}

export async function runBookingTransaction<T>(
  unitId: string,
  handler: (sql: DbExecutor) => Promise<T>
) {
  const sql = getDb();
  return sql.begin(async (transaction) => {
    await transaction.unsafe("SELECT pg_advisory_xact_lock(hashtext($1))", [unitId]);
    return handler(transaction);
  });
}

export async function hasActiveOverlap(input: {
  bookingDate: string;
  bookingId?: string;
  endMinutes: number;
  sql: DbExecutor;
  startMinutes: number;
  unitId: string;
}) {
  const [row] = await input.sql.unsafe<{ id: string }[]>(
    `
      SELECT id
      FROM bookings
      WHERE unit_id = $1
        AND booking_date = $2
        AND status IN ('pending_confirmation', 'confirmed')
        AND (
          expires_at IS NULL
          OR expires_at > NOW()
        )
        AND id != COALESCE($3, id)
        AND start_minutes < $4
        AND end_minutes > $5
      LIMIT 1
    `,
    [
      input.unitId,
      input.bookingDate,
      input.bookingId || null,
      input.endMinutes,
      input.startMinutes
    ]
  );

  return Boolean(row);
}
