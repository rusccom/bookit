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
