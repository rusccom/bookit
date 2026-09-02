import type { Row } from "postgres";

import type { AdminBookingRecord } from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";
import { formatMinutes, toIsoDateLabel } from "@/features/shared/server/dateTime";

type AdminBookingRow = Row & {
  booking_date: Date;
  customer_name: string;
  customer_phone: string | null;
  end_minutes: number;
  id: string;
  owner_name: string;
  source: string;
  start_minutes: number;
  status: string;
  unit_title: string;
  venue_title: string;
};

export async function listAdminBookings(filters: {
  date: string;
  limit?: number;
  search: string;
  status: string;
}): Promise<AdminBookingRecord[]> {
  const sql = getDb();
  const query = filters.search.trim();
  const phoneQuery = query.replace(/\D/g, "");
  const rows = await sql<AdminBookingRow[]>`
    SELECT b.id, b.booking_date, b.start_minutes, b.end_minutes, b.status, b.source,
           u.title AS unit_title, v.title AS venue_title,
           COALESCE(c.full_name, 'Без клиента') AS customer_name,
           c.phone AS customer_phone, o.full_name AS owner_name
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    JOIN app_users o ON o.id = p.owner_user_id
    LEFT JOIN app_users c ON c.id = b.customer_user_id
    WHERE (${filters.status} = '' OR b.status = ${filters.status})
      AND (${filters.date} = '' OR b.booking_date = ${filters.date || null})
      AND (${query} = '' OR COALESCE(c.full_name, '') ILIKE ${`%${query}%`}
        OR o.full_name ILIKE ${`%${query}%`} OR v.title ILIKE ${`%${query}%`}
        OR u.title ILIKE ${`%${query}%`} OR COALESCE(c.phone, '') ILIKE ${`%${query}%`}
        OR (${phoneQuery} != '' AND regexp_replace(COALESCE(c.phone, ''), '\\D', '', 'g') ILIKE ${`%${phoneQuery}%`}))
    ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT ${filters.limit || 300}
  `;
  return rows.map(mapBooking);
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

function mapBooking(row: AdminBookingRow): AdminBookingRecord {
  return {
    bookingId: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    date: toIsoDateLabel(row.booking_date),
    ownerName: row.owner_name,
    source: row.source,
    status: row.status,
    time: `${formatMinutes(row.start_minutes)}–${formatMinutes(row.end_minutes)}`,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}
