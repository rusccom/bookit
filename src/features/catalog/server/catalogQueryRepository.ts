import type { CatalogUnitRow } from "@/features/catalog/server/catalogRepositoryMappers";
import {
  groupOwnerUnits,
  mapSearchUnit
} from "@/features/catalog/server/catalogRepositoryMappers";
import type { OwnerUnit, SearchUnit } from "@/features/catalog/server/catalogTypes";
import { getDb } from "@/features/database/server/client";

const UNIT_COLUMNS = `
  u.id AS unit_id, u.title AS unit_title, u.kind, u.surface, u.description,
  u.price_per_hour::TEXT, u.slot_minutes, u.is_active, v.is_active AS is_venue_active,
  v.title AS venue_title, v.city, v.address,
  r.id AS rule_id, r.weekday AS rule_weekday,
  r.start_minutes AS rule_start, r.end_minutes AS rule_end
`;

export async function listOwnerUnits(ownerUserId: string): Promise<OwnerUnit[]> {
  const sql = getDb();
  const rows = await sql.unsafe<CatalogUnitRow[]>(`
    SELECT ${UNIT_COLUMNS}
    FROM providers p
    JOIN venues v ON v.provider_id = p.id
    JOIN bookable_units u ON u.venue_id = v.id
    LEFT JOIN availability_rules r ON r.unit_id = u.id
    WHERE p.owner_user_id = $1
    ORDER BY v.city, v.title, u.title, r.weekday
  `, [ownerUserId]);
  return groupOwnerUnits(rows);
}

export async function findOwnerUnitDetails(input: {
  ownerUserId: string;
  unitId: string;
}): Promise<OwnerUnit | null> {
  const units = await listOwnerUnits(input.ownerUserId);
  return units.find((unit) => unit.unitId === input.unitId) || null;
}

export async function listDistinctCities(): Promise<string[]> {
  const sql = getDb();
  const rows = await sql<{ city: string }[]>`
    SELECT DISTINCT city FROM venues
    WHERE is_active = TRUE AND EXISTS (
      SELECT 1 FROM bookable_units u
      WHERE u.venue_id = venues.id AND u.is_active = TRUE
    )
    ORDER BY city
  `;
  return rows.map((row) => row.city);
}

export async function listSearchUnits(filters: {
  city: string;
  venueQuery?: string;
}): Promise<SearchUnit[]> {
  const sql = getDb();
  const query = filters.venueQuery?.trim() || null;
  const rows = await sql.unsafe<CatalogUnitRow[]>(`
    SELECT ${UNIT_COLUMNS}
    FROM venues v
    JOIN bookable_units u ON u.venue_id = v.id
    LEFT JOIN availability_rules r ON FALSE
    WHERE v.city = $1 AND v.is_active = TRUE AND u.is_active = TRUE
      AND ($2::TEXT IS NULL OR v.title ILIKE $3 OR u.title ILIKE $3)
    ORDER BY v.title, u.title
  `, [filters.city, query, query ? `%${query}%` : null]);
  return rows.map(mapSearchUnit);
}
