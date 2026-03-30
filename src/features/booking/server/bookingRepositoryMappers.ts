import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import type { BookingRecord, UnitOption } from "@/features/booking/server/bookingTypes";
import type {
  BookingRow,
  RuleRow,
  UnitRow
} from "@/features/booking/server/bookingRepositoryTypes";

export function groupRules(rows: RuleRow[]) {
  const map = new Map<string, AvailabilityRule[]>();

  for (const row of rows) {
    const items = map.get(row.unit_id) || [];
    items.push(mapRule(row));
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
    dateLabel: row.booking_date,
    endTime: minutesToTime(row.end_minutes),
    note: row.note,
    source: row.source,
    startTime: minutesToTime(row.start_minutes),
    status: row.status,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

export function mapUnit(row: UnitRow): UnitOption {
  return {
    address: row.address,
    city: row.city,
    kind: row.kind,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

function mapRule(row: RuleRow): AvailabilityRule {
  return {
    endMinutes: row.end_minutes,
    id: row.id,
    startMinutes: row.start_minutes,
    weekday: row.weekday
  };
}

function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
