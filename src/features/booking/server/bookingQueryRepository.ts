import { getDb } from "@/features/database/server/client";
import { mapBooking } from "@/features/booking/server/bookingRepositoryMappers";
import type { BookingRow } from "@/features/booking/server/bookingRepositoryTypes";

const BOOKING_IS_VISIBLE = `(b.status != 'pending_confirmation'
  OR b.expires_at IS NULL OR b.expires_at > NOW())`;

const BOOKING_SELECT = `
  SELECT b.id, b.unit_id, b.booking_date, b.start_minutes, b.end_minutes,
    b.status, b.note, b.source, u.title AS unit_title,
    v.title AS venue_title, v.city, v.address
  FROM bookings b
  JOIN bookable_units u ON u.id = b.unit_id
  JOIN venues v ON v.id = u.venue_id
`;

const OWNER_BOOKING_SELECT = `
  SELECT b.id, b.unit_id, b.booking_date, b.start_minutes, b.end_minutes,
    b.status, b.note, b.source, c.full_name AS customer_name,
    c.phone AS customer_phone, u.title AS unit_title,
    v.title AS venue_title, v.city, v.address
  FROM bookings b
  JOIN bookable_units u ON u.id = b.unit_id
  JOIN venues v ON v.id = u.venue_id
  JOIN providers p ON p.id = v.provider_id
  LEFT JOIN app_users c ON c.id = b.customer_user_id
`;

const OWNER_STATS_QUERY = `
  SELECT (SELECT COUNT(*) FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id WHERE p.owner_user_id = $1
      AND b.booking_date = $2 AND b.status != 'cancelled'
      AND ${BOOKING_IS_VISIBLE}) AS today_count,
    (SELECT COUNT(*) FROM bookable_units u JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id WHERE p.owner_user_id = $1) AS total_units
`;

export async function findTelegramPendingBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const sql = getDb();
  const query = `${BOOKING_SELECT} WHERE b.id = $1 AND b.telegram_chat_id = $2
    AND b.status = 'pending_confirmation'
    AND (b.expires_at IS NULL OR b.expires_at > NOW())`;
  const [row] = await sql.unsafe<BookingRow[]>(query, [input.bookingId, input.chatId]);
  return row ? mapBooking(row) : null;
}
export async function getBookingForActor(input: {
  actorUserId: string;
  actorRole: string;
  bookingId: string;
}) {
  const sql = getDb();
  const owner = input.actorRole === "owner";
  const query = owner
    ? `${OWNER_BOOKING_SELECT} WHERE b.id = $1 AND p.owner_user_id = $2`
    : `${BOOKING_SELECT} WHERE b.id = $1 AND b.customer_user_id = $2`;
  const [row] = await sql.unsafe<BookingRow[]>(query, [input.bookingId, input.actorUserId]);
  return row ? mapBooking(row) : null;
}

export async function listOwnerBookings(ownerUserId: string) {
  const sql = getDb();
  const query = `${OWNER_BOOKING_SELECT} WHERE p.owner_user_id = $1
    AND ${BOOKING_IS_VISIBLE}
    ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT 100`;
  const rows = await sql.unsafe<BookingRow[]>(query, [ownerUserId]);
  return rows.map(mapBooking);
}

export async function listCustomerBookings(customerUserId: string) {
  const sql = getDb();
  const query = `${BOOKING_SELECT} WHERE b.customer_user_id = $1
    AND ${BOOKING_IS_VISIBLE}
    ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT 20`;
  const rows = await sql.unsafe<BookingRow[]>(query, [customerUserId]);
  return rows.map(mapBooking);
}

export async function listUpcomingCustomerBooking(input: {
  customerUserId: string;
  minimumStart: number;
  today: string;
}) {
  const sql = getDb();
  const query = `${BOOKING_SELECT} WHERE b.customer_user_id = $1
      AND b.status IN ('confirmed', 'pending_confirmation')
      AND ${BOOKING_IS_VISIBLE}
      AND (b.booking_date > $2 OR (b.booking_date = $2 AND b.start_minutes >= $3))
    ORDER BY b.booking_date ASC, b.start_minutes ASC LIMIT 1`;
  const [row] = await sql.unsafe<BookingRow[]>(query, [input.customerUserId, input.today, input.minimumStart]);
  return row ? mapBooking(row) : null;
}

export async function listOwnerTodayBookings(ownerUserId: string, date: string) {
  const sql = getDb();
  const query = `${OWNER_BOOKING_SELECT} WHERE p.owner_user_id = $1
      AND b.booking_date = $2
      AND b.status != 'cancelled'
      AND ${BOOKING_IS_VISIBLE}
    ORDER BY b.start_minutes ASC`;
  const rows = await sql.unsafe<BookingRow[]>(query, [ownerUserId, date]);
  return rows.map(mapBooking);
}

export async function getOwnerStats(ownerUserId: string, today: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<{ today_count: string; total_units: string }[]>(OWNER_STATS_QUERY, [ownerUserId, today]);
  return {
    todayCount: Number(row?.today_count ?? 0),
    totalUnits: Number(row?.total_units ?? 0),
  };
}
