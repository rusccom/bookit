import type { Row } from "postgres";

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
  surface: string;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

export function groupOwnerUnits(rows: CatalogUnitRow[]): OwnerUnit[] {
  const units = new Map<string, OwnerUnit>();
  for (const row of rows) appendOwnerUnit(units, row);
  return [...units.values()];
}

export function mapSearchUnit(row: CatalogUnitRow): SearchUnit {
  return {
    address: row.address,
    city: row.city,
    description: row.description,
    kind: row.kind,
    pricePerHour: Number(row.price_per_hour),
    surface: row.surface,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}

function appendOwnerUnit(units: Map<string, OwnerUnit>, row: CatalogUnitRow) {
  const unit = units.get(row.unit_id) || createOwnerUnit(row);
  const rule = mapRule(row);
  if (rule) unit.rules.push(rule);
  units.set(row.unit_id, unit);
}

function createOwnerUnit(row: CatalogUnitRow): OwnerUnit {
  return {
    ...mapSearchUnit(row),
    isActive: row.is_active,
    isVenueActive: row.is_venue_active,
    rules: []
  };
}

function mapRule(row: CatalogUnitRow): AvailabilityRule | null {
  if (!row.rule_id || row.rule_weekday === null) return null;
  return {
    endMinutes: Number(row.rule_end),
    id: row.rule_id,
    startMinutes: Number(row.rule_start),
    weekday: row.rule_weekday
  };
}
