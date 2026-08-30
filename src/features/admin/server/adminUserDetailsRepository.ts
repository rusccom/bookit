import type { Row } from "postgres";

import type {
  AdminUserBooking,
  AdminUserCatalogItem
} from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";

type BookingRow = Row & {
  booking_date: string;
  end_minutes: number;
  id: string;
  start_minutes: number;
  status: string;
  unit_title: string;
  venue_title: string;
};

type CatalogRow = Row & {
  city: string;
  is_active: boolean;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

export async function listUserAdminBookings(userId: string) {
  const sql = getDb();
  const rows = await sql<BookingRow[]>`
    SELECT DISTINCT b.id, b.booking_date, b.start_minutes, b.end_minutes, b.status,
           u.title AS unit_title, v.title AS venue_title
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    WHERE b.customer_user_id = ${userId} OR b.created_by_user_id = ${userId}
      OR p.owner_user_id = ${userId}
    ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT 30
  `;
  return rows.map(mapBooking);
}

export async function listUserAdminCatalog(userId: string) {
  const sql = getDb();
  const rows = await sql<CatalogRow[]>`
    SELECT u.id AS unit_id, u.title AS unit_title, v.title AS venue_title,
           v.city, (u.is_active AND v.is_active) AS is_active
    FROM providers p
    JOIN venues v ON v.provider_id = p.id
    JOIN bookable_units u ON u.venue_id = v.id
    WHERE p.owner_user_id = ${userId}
    ORDER BY v.city, v.title, u.title
  `;
  return rows.map(mapCatalog);
}

function mapBooking(row: BookingRow): AdminUserBooking {
  return {
    bookingId: row.id,
    date: row.booking_date,
    status: row.status,
    time: `${toTime(row.start_minutes)}–${toTime(row.end_minutes)}`,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

function mapCatalog(row: CatalogRow): AdminUserCatalogItem {
  return {
    city: row.city,
    isActive: row.is_active,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

function toTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
