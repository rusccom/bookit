import { getDb } from "@/features/database/server/client";
import { mapBooking } from "@/features/booking/server/bookingRepositoryMappers";
import type { BookingRow } from "@/features/booking/server/bookingRepositoryTypes";

export async function findBookingById(bookingId: string) {
  const sql = getDb();
  const [row] = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.id = ${bookingId}
  `;

  return row ? mapBooking(row) : null;
}

export async function findTelegramPendingBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const sql = getDb();
  const [row] = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.id = ${input.bookingId}
      AND b.telegram_chat_id = ${input.chatId}
      AND b.status = 'pending_confirmation'
      AND (
        b.expires_at IS NULL
        OR b.expires_at > NOW()
      )
  `;

  return row ? mapBooking(row) : null;
}

export async function getBookingForActor(input: {
  actorUserId: string;
  actorRole: string;
  bookingId: string;
}) {
  return input.actorRole === "owner"
    ? getOwnerBooking(input)
    : getCustomerBooking(input);
}

export async function listOwnerBookings(ownerUserId: string) {
  const sql = getDb();
  const rows = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    WHERE p.owner_user_id = ${ownerUserId}
    ORDER BY b.booking_date DESC, b.start_minutes DESC
    LIMIT 20
  `;

  return rows.map(mapBooking);
}

export async function listCustomerBookings(customerUserId: string) {
  const sql = getDb();
  const rows = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.customer_user_id = ${customerUserId}
    ORDER BY b.booking_date DESC, b.start_minutes DESC
    LIMIT 20
  `;

  return rows.map(mapBooking);
}

async function getOwnerBooking(input: {
  actorUserId: string;
  bookingId: string;
}) {
  const sql = getDb();
  const [row] = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    WHERE b.id = ${input.bookingId}
      AND p.owner_user_id = ${input.actorUserId}
  `;

  return row ? mapBooking(row) : null;
}

export async function listUpcomingCustomerBooking(customerUserId: string) {
  const sql = getDb();
  const [row] = await sql<BookingRow[]>`
    SELECT
      b.id, b.unit_id, b.booking_date, b.start_minutes, b.end_minutes,
      b.status, b.note, b.source,
      u.title AS unit_title, v.title AS venue_title, v.city, v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.customer_user_id = ${customerUserId}
      AND b.status IN ('confirmed', 'pending_confirmation')
      AND b.booking_date >= CURRENT_DATE
    ORDER BY b.booking_date ASC, b.start_minutes ASC
    LIMIT 1
  `;

  return row ? mapBooking(row) : null;
}

export async function listOwnerTodayBookings(ownerUserId: string, date: string) {
  const sql = getDb();
  const rows = await sql<BookingRow[]>`
    SELECT
      b.id, b.unit_id, b.booking_date, b.start_minutes, b.end_minutes,
      b.status, b.note, b.source,
      u.title AS unit_title, v.title AS venue_title, v.city, v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    WHERE p.owner_user_id = ${ownerUserId}
      AND b.booking_date = ${date}
      AND b.status != 'cancelled'
    ORDER BY b.start_minutes ASC
  `;

  return rows.map(mapBooking);
}

export async function getOwnerStats(ownerUserId: string, today: string) {
  const sql = getDb();
  const [row] = await sql<{ today_count: string; total_units: string }[]>`
    SELECT
      (SELECT COUNT(*)
       FROM bookings b
       JOIN bookable_units u ON u.id = b.unit_id
       JOIN venues v ON v.id = u.venue_id
       JOIN providers p ON p.id = v.provider_id
       WHERE p.owner_user_id = ${ownerUserId}
         AND b.booking_date = ${today}
         AND b.status != 'cancelled'
      ) AS today_count,
      (SELECT COUNT(*)
       FROM bookable_units u
       JOIN venues v ON v.id = u.venue_id
       JOIN providers p ON p.id = v.provider_id
       WHERE p.owner_user_id = ${ownerUserId}
      ) AS total_units
  `;

  return {
    todayCount: Number(row?.today_count ?? 0),
    totalUnits: Number(row?.total_units ?? 0),
  };
}

async function getCustomerBooking(input: {
  actorUserId: string;
  bookingId: string;
}) {
  const sql = getDb();
  const [row] = await sql<BookingRow[]>`
    SELECT
      b.id,
      b.unit_id,
      b.booking_date,
      b.start_minutes,
      b.end_minutes,
      b.status,
      b.note,
      b.source,
      u.title AS unit_title,
      v.title AS venue_title,
      v.city,
      v.address
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.id = ${input.bookingId}
      AND b.customer_user_id = ${input.actorUserId}
  `;

  return row ? mapBooking(row) : null;
}
