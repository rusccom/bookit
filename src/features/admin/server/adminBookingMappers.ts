import type { Row } from "postgres";
import type { AdminBookingRecord, AdminUserBooking } from "./adminTypes";
import { formatMinuteRange, toIsoDateLabel } from "@/features/shared/server/dateTime";

export type AdminBookingBaseRow = Row & {
  booking_date: Date; end_minutes: number; id: string; start_minutes: number;
  status: string; unit_title: string; venue_title: string;
};

export type AdminBookingRow = AdminBookingBaseRow & {
  customer_name: string; customer_phone: string | null; owner_name: string; source: string;
};

export function mapAdminUserBooking(row: AdminBookingBaseRow): AdminUserBooking {
  return {
    bookingId: row.id, date: toIsoDateLabel(row.booking_date), status: row.status,
    time: formatMinuteRange(row.start_minutes, row.end_minutes),
    unitTitle: row.unit_title, venueTitle: row.venue_title
  };
}

export function mapAdminBookingRecord(row: AdminBookingRow): AdminBookingRecord {
  return {
    ...mapAdminUserBooking(row), customerName: row.customer_name,
    customerPhone: row.customer_phone, ownerName: row.owner_name, source: row.source
  };
}
