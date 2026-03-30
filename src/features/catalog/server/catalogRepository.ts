import type { Row } from "postgres";

import type {
  AvailabilityRule,
  OwnerUnit,
  SearchUnit
} from "@/features/catalog/server/catalogTypes";
import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";

type ProviderRow = Row & {
  id: string;
};

type UnitRow = Row & {
  address: string;
  city: string;
  kind: string;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

type RuleRow = Row & {
  end_minutes: number;
  id: string;
  start_minutes: number;
  unit_id: string;
  weekday: number;
};

type CreateUnitInput = {
  address: string;
  city: string;
  days: number[];
  kind: string;
  ownerUserId: string;
  startMinutes: number;
  title: string;
  venueTitle: string;
  endMinutes: number;
};

export async function findProviderIdByOwner(ownerUserId: string) {
  const sql = getDb();
  const [row] = await sql<ProviderRow[]>`
    SELECT id
    FROM providers
    WHERE owner_user_id = ${ownerUserId}
  `;

  return row?.id || null;
}

export async function createUnitWithRules(input: CreateUnitInput) {
  const sql = getDb();
  const providerId = await findProviderIdByOwner(input.ownerUserId);

  if (!providerId) {
    throw new Error("Provider profile not found");
  }

  await sql.begin(async (transaction) => {
    const venueId = createId();
    const unitId = createId();

    await transaction.unsafe(
      `
        INSERT INTO venues (
          id,
          provider_id,
          city,
          title,
          address
        ) VALUES (
          $1, $2, $3, $4, $5
        )
      `,
      [venueId, providerId, input.city, input.venueTitle, input.address]
    );

    await transaction.unsafe(
      `
        INSERT INTO bookable_units (
          id,
          venue_id,
          kind,
          title
        ) VALUES (
          $1, $2, $3, $4
        )
      `,
      [unitId, venueId, input.kind, input.title]
    );

    for (const weekday of input.days) {
      await transaction.unsafe(
        `
          INSERT INTO availability_rules (
            id,
            unit_id,
            weekday,
            start_minutes,
            end_minutes
          ) VALUES (
            $1, $2, $3, $4, $5
          )
        `,
        [createId(), unitId, weekday, input.startMinutes, input.endMinutes]
      );
    }
  });
}

export async function listOwnerUnits(ownerUserId: string): Promise<OwnerUnit[]> {
  const sql = getDb();
  const rows = await sql<(UnitRow & RuleRow)[]>`
    SELECT
      u.id AS unit_id,
      u.title AS unit_title,
      u.kind,
      v.title AS venue_title,
      v.city,
      v.address,
      r.id,
      r.weekday,
      r.start_minutes,
      r.end_minutes
    FROM providers p
    JOIN venues v ON v.provider_id = p.id
    JOIN bookable_units u ON u.venue_id = v.id
    JOIN availability_rules r ON r.unit_id = u.id
    WHERE p.owner_user_id = ${ownerUserId}
    ORDER BY v.city, v.title, u.title, r.weekday
  `;

  return groupOwnerUnits(rows);
}

export async function listDistinctCities(): Promise<string[]> {
  const sql = getDb();
  const rows = await sql<{ city: string }[]>`
    SELECT DISTINCT city
    FROM venues
    ORDER BY city
  `;

  return rows.map((row) => row.city);
}

export async function listSearchUnits(filters: {
  city: string;
  venueQuery?: string;
}): Promise<SearchUnit[]> {
  const sql = getDb();
  const venueQuery = filters.venueQuery?.trim();

  const rows = await sql<UnitRow[]>`
    SELECT
      u.id AS unit_id,
      u.title AS unit_title,
      u.kind,
      v.title AS venue_title,
      v.city,
      v.address
    FROM venues v
    JOIN bookable_units u ON u.venue_id = v.id
    WHERE v.city = ${filters.city}
      AND (
        ${venueQuery || null} IS NULL
        OR v.title ILIKE ${`%${venueQuery}%`}
        OR u.title ILIKE ${`%${venueQuery}%`}
      )
    ORDER BY v.title, u.title
  `;

  return rows.map(mapSearchUnit);
}

function groupOwnerUnits(rows: (UnitRow & RuleRow)[]): OwnerUnit[] {
  const units = new Map<string, OwnerUnit>();

  for (const row of rows) {
    const existing = units.get(row.unit_id);

    if (!existing) {
      units.set(row.unit_id, {
        address: row.address,
        city: row.city,
        kind: row.kind,
        rules: [mapRule(row)],
        unitId: row.unit_id,
        unitTitle: row.unit_title,
        venueTitle: row.venue_title
      });
      continue;
    }

    existing.rules.push(mapRule(row));
  }

  return [...units.values()];
}

function mapRule(row: RuleRow): AvailabilityRule {
  return {
    endMinutes: row.end_minutes,
    id: row.id,
    startMinutes: row.start_minutes,
    weekday: row.weekday
  };
}

function mapSearchUnit(row: UnitRow): SearchUnit {
  return {
    address: row.address,
    city: row.city,
    kind: row.kind,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueTitle: row.venue_title
  };
}
