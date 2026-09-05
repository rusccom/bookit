import { mapAdminUserBooking, type AdminBookingBaseRow } from "@/features/admin/server/adminBookingMappers";
import { mapAdminUserCatalog, type AdminCatalogBaseRow } from "@/features/admin/server/adminCatalogMappers";
import { getDb } from "@/features/database/server/client";

export async function listUserAdminBookings(userId: string) {
  const sql = getDb();
  const rows = await sql<AdminBookingBaseRow[]>`
    SELECT b.id, b.booking_date, b.start_minutes, b.end_minutes, b.status,
           u.title AS unit_title, v.title AS venue_title
    FROM bookings b
    JOIN bookable_units u ON u.id = b.unit_id
    JOIN venues v ON v.id = u.venue_id
    WHERE b.customer_user_id = ${userId}
    ORDER BY b.booking_date DESC, b.start_minutes DESC LIMIT 30
  `;
  return rows.map(mapAdminUserBooking);
}

export async function listUserAdminCatalog(userId: string) {
  const sql = getDb();
  const rows = await sql<AdminCatalogBaseRow[]>`
    SELECT u.id AS unit_id, u.title AS unit_title, v.title AS venue_title,
           v.city, (u.is_active AND v.is_active) AS is_active
    FROM providers p
    JOIN venues v ON v.provider_id = p.id
    JOIN bookable_units u ON u.venue_id = v.id
    WHERE p.owner_user_id = ${userId}
    ORDER BY v.city, v.title, u.title
  `;
  return rows.map(mapAdminUserCatalog);
}
