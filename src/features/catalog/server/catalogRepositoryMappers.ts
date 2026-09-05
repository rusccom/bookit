import type { Row } from "postgres";
import type { SlotMinutes } from "@/features/catalog/slotOptions";

import type {
  AvailabilityRule,
  OwnerUnit,
  SearchUnit
} from "@/features/catalog/server/catalogTypes";

export type CatalogUnitRow = Row & {
  address: string;
  city: string;
  description: string;
  is_active: boolean;
  is_venue_active: boolean;
  kind: string;
  price_per_hour: string;
  rule_end: number | null;
  rule_id: string | null;
  rule_start: number | null;
  rule_weekday: number | null;
  slot_minutes: SlotMinutes;
  surface: string;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

type RuleRow = { end_minutes: number; id: string; start_minutes: number; weekday: number };
type SearchUnitRow = Pick<CatalogUnitRow, "address" | "city" | "description" | "kind" |
  "price_per_hour" | "slot_minutes" | "surface" | "unit_id" | "unit_title" | "venue_title">;

export function groupOwnerUnits(rows: CatalogUnitRow[]): OwnerUnit[] {
  const units = new Map<string, OwnerUnit>();
  for (const row of rows) appendOwnerUnit(units, row);
  return [...units.values()];
}

export function mapSearchUnit(row: SearchUnitRow): SearchUnit {
  return {
    address: row.address,
    city: row.city,
    description: row.description,
    kind: row.kind,
    pricePerHour: Number(row.price_per_hour),
    slotMinutes: row.slot_minutes,
    surface: row.surface,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

function appendOwnerUnit(units: Map<string, OwnerUnit>, row: CatalogUnitRow) {
  const unit = units.get(row.unit_id) || mapOwnerUnit(row);
  const rule = mapRule(row);
  if (rule) unit.rules.push(rule);
  units.set(row.unit_id, unit);
}

function mapOwnerUnit(row: CatalogUnitRow): OwnerUnit {
  return {
    ...mapSearchUnit(row),
    isActive: row.is_active,
    isVenueActive: row.is_venue_active,
    rules: []
  };
}

export function mapAvailabilityRule(row: RuleRow): AvailabilityRule {
  return { endMinutes: row.end_minutes, id: row.id,
    startMinutes: row.start_minutes, weekday: row.weekday };
}

function mapRule(row: CatalogUnitRow): AvailabilityRule | null {
  if (!row.rule_id || row.rule_weekday === null) return null;
  return mapAvailabilityRule({ end_minutes: Number(row.rule_end), id: row.rule_id,
    start_minutes: Number(row.rule_start), weekday: row.rule_weekday });
}
