import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import { mapAvailabilityRule } from "@/features/catalog/server/catalogRepositoryMappers";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import type {
  BookingRow,
  RuleRow,
} from "@/features/booking/server/bookingRepositoryTypes";
import { formatMinutes, toIsoDateLabel } from "@/features/shared/server/dateTime";

export function groupRules(rows: RuleRow[]) {
  const map = new Map<string, AvailabilityRule[]>();

  for (const row of rows) {
    const items = map.get(row.unit_id) || [];
    items.push(mapAvailabilityRule(row));
    map.set(row.unit_id, items);
  }

  return map;
}
export function groupBookings(
  rows: {
    end_minutes: number;
    start_minutes: number;
    unit_id: string;
  }[]
) {
  const map = new Map<string, { endMinutes: number; startMinutes: number }[]>();

  for (const row of rows) {
    const items = map.get(row.unit_id) || [];
    items.push({
      endMinutes: row.end_minutes,
      startMinutes: row.start_minutes
    });
    map.set(row.unit_id, items);
  }

  return map;
}

export function mapBooking(row: BookingRow): BookingRecord {
  return {
    address: row.address,
    bookingId: row.id,
    city: row.city,
    customerName: row.customer_name || null,
    customerPhone: row.customer_phone || null,
    dateLabel: toIsoDateLabel(row.booking_date),
    endTime: formatMinutes(row.end_minutes),
    note: row.note,
    source: row.source,
    startTime: formatMinutes(row.start_minutes),
    status: row.status,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}
