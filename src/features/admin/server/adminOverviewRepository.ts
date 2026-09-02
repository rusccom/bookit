import type { AdminOverviewStats } from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";

type StatsRow = {
  bookings_today: string;
  cancelled_bookings: string;
  owners: string;
  upcoming_bookings: string;
  units: string;
  users: string;
  venues: string;
};

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const sql = getDb();
  const [row] = await sql<StatsRow[]>`
    SELECT
      (SELECT COUNT(*) FROM app_users)::TEXT AS users,
      (SELECT COUNT(*) FROM app_users WHERE role = 'owner')::TEXT AS owners,
      (SELECT COUNT(*) FROM venues)::TEXT AS venues,
      (SELECT COUNT(*) FROM bookable_units)::TEXT AS units,
      (SELECT COUNT(*) FROM bookings WHERE booking_date = (NOW() AT TIME ZONE 'Europe/Minsk')::DATE)::TEXT AS bookings_today,
      (SELECT COUNT(*) FROM bookings WHERE status = 'cancelled')::TEXT AS cancelled_bookings,
      (SELECT COUNT(*) FROM bookings WHERE booking_date + make_interval(mins => start_minutes) > NOW() AT TIME ZONE 'Europe/Minsk'
        AND status IN ('confirmed', 'pending_confirmation')
        AND (expires_at IS NULL OR expires_at > NOW()))::TEXT AS upcoming_bookings
  `;
  return mapStats(row);
}

function mapStats(row: StatsRow): AdminOverviewStats {
  return {
    bookingsToday: Number(row.bookings_today),
    cancelledBookings: Number(row.cancelled_bookings),
    owners: Number(row.owners),
    upcomingBookings: Number(row.upcoming_bookings),
    units: Number(row.units),
    users: Number(row.users),
    venues: Number(row.venues)
  };
}
