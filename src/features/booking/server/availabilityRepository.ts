import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";

import { getDb } from "@/features/database/server/client";
import { groupBookings, groupRules, mapUnit } from "@/features/booking/server/bookingRepositoryMappers";
import type {
  RuleRow,
  UnitRow
} from "@/features/booking/server/bookingRepositoryTypes";

const UNIT_COLUMNS = `u.id AS unit_id, u.title AS unit_title, u.kind, u.surface,
  u.description, u.price_per_hour::TEXT, u.slot_minutes,
  v.title AS venue_title, v.city, v.address`;

export async function listRulesByUnits(input: {
  unitIds: string[];
  weekday: number;
}) {
  const sql = getDb();

  if (!input.unitIds.length) {
    return new Map<string, AvailabilityRule[]>();
  }

  const rows = await sql<RuleRow[]>`
    SELECT id, unit_id, weekday, start_minutes, end_minutes
    FROM availability_rules
    WHERE unit_id = ANY(${input.unitIds})
      AND weekday = ${input.weekday}
    ORDER BY start_minutes
  `;

  return groupRules(rows);
}

export async function listActiveBookingsByUnits(input: {
  bookingDate: string;
  unitIds: string[];
}) {
  const sql = getDb();
  if (!input.unitIds.length) return new Map<string, { endMinutes: number; startMinutes: number }[]>();
  const rows = await sql<{ end_minutes: number; start_minutes: number; unit_id: string }[]>`
    SELECT unit_id, start_minutes, end_minutes
    FROM bookings
    WHERE unit_id = ANY(${input.unitIds})
      AND booking_date = ${input.bookingDate}
      AND status IN ('pending_confirmation', 'confirmed')
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY start_minutes
  `;

  return groupBookings(rows);
}

export async function listUnitsForAvailability(filters: {
  city: string;
  venueQuery?: string;
}) {
  const sql = getDb();
  const venueQuery = filters.venueQuery?.trim() || null;
  const rows = await sql.unsafe<UnitRow[]>(`
    SELECT ${UNIT_COLUMNS}
    FROM venues v
    JOIN bookable_units u ON u.venue_id = v.id
    WHERE v.city = $1 AND v.is_active AND u.is_active
      AND ($2::TEXT IS NULL OR v.title ILIKE $3 OR u.title ILIKE $3)
    ORDER BY v.title, u.title
  `, [filters.city, venueQuery, venueQuery ? `%${venueQuery}%` : null]);

  return rows.map(mapUnit);
}

export async function findOwnerUnit(input: {
  ownerUserId: string;
  unitId: string;
}) {
  const sql = getDb();
  const [row] = await sql.unsafe<UnitRow[]>(`
    SELECT ${UNIT_COLUMNS}
    FROM bookable_units u
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    WHERE u.id = $1 AND p.owner_user_id = $2 AND v.is_active AND u.is_active
  `, [input.unitId, input.ownerUserId]);

  return row ? mapUnit(row) : null;
}

export async function findUnit(unitId: string) {
  const sql = getDb();
  const [row] = await sql.unsafe<UnitRow[]>(`
    SELECT ${UNIT_COLUMNS}
    FROM bookable_units u
    JOIN venues v ON v.id = u.venue_id
    WHERE u.id = $1 AND v.is_active AND u.is_active
  `, [unitId]);

  return row ? mapUnit(row) : null;
}
