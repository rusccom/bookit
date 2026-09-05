import { mapAdminBookingRecord, type AdminBookingRow } from "@/features/admin/server/adminBookingMappers";
import type { AdminBookingRecord } from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";
import { toIsoDateLabel } from "@/features/shared/server/dateTime";

const LIST_ADMIN_BOOKINGS = `
  SELECT b.id, b.booking_date, b.start_minutes, b.end_minutes, b.status, b.source,
    u.title AS unit_title, v.title AS venue_title,
    COALESCE(c.full_name, 'Без клиента') AS customer_name,
    c.phone AS customer_phone, o.full_name AS owner_name
  FROM bookings b JOIN bookable_units u ON u.id = b.unit_id
  JOIN venues v ON v.id = u.venue_id JOIN providers p ON p.id = v.provider_id
  JOIN app_users o ON o.id = p.owner_user_id LEFT JOIN app_users c ON c.id = b.customer_user_id
  WHERE ($1 = '' OR b.status = $1) AND ($2::DATE IS NULL OR b.booking_date = $2::DATE)
    AND ($3 = '' OR COALESCE(c.full_name, '') ILIKE $4 OR o.full_name ILIKE $4
      OR v.title ILIKE $4 OR u.title ILIKE $4 OR COALESCE(c.phone, '') ILIKE $4
      OR ($5 != '' AND regexp_replace(COALESCE(c.phone, ''), '\\D', '', 'g') ILIKE $6))
  ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT $7
`;

export async function listAdminBookings(filters: {
  date: string;
  limit?: number;
  search: string;
  status: string;
}): Promise<AdminBookingRecord[]> {
  const sql = getDb();
  const query = filters.search.trim();
  const phoneQuery = query.replace(/\D/g, "");
  const rows = await sql.unsafe<AdminBookingRow[]>(LIST_ADMIN_BOOKINGS, [
    filters.status, filters.date || null, query, `%${query}%`,
    phoneQuery, `%${phoneQuery}%`, filters.limit || 300
  ]);
  return rows.map(mapAdminBookingRecord);
}
export async function setAdminBookingStatus(input: {
  bookingId: string;
  status: string;
}) {
  const sql = getDb();
  const rows = await sql<{ id: string }[]>`
    UPDATE bookings SET status = ${input.status}, expires_at = NULL
    WHERE id = ${input.bookingId} RETURNING id
  `;
  return Boolean(rows[0]);
}

export async function findAdminBookingSlot(bookingId: string) {
  const sql = getDb();
  const [row] = await sql<{
    booking_date: Date;
    end_minutes: number;
    start_minutes: number;
    unit_id: string;
  }[]>`
    SELECT booking_date, start_minutes, end_minutes, unit_id
    FROM bookings WHERE id = ${bookingId}
  `;
  return row ? { ...row, booking_date: toIsoDateLabel(row.booking_date) } : null;
}
