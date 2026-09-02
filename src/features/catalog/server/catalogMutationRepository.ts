import type { Sql } from "postgres";

import type { WeeklyScheduleEntry } from "@/features/catalog/server/catalogTypes";
import type { SlotMinutes } from "@/features/catalog/slotOptions";
import { getDb } from "@/features/database/server/client";
import { createId } from "@/features/shared/server/id";

type CatalogDb = Pick<Sql<Record<string, never>>, "unsafe">;

export type CourtMutationInput = {
  address: string;
  city: string;
  description: string;
  kind: string;
  ownerUserId: string;
  pricePerHour: number;
  schedule: WeeklyScheduleEntry[];
  slotMinutes: SlotMinutes;
  surface: string;
  title: string;
  venueTitle: string;
};

export async function createUnitWithRules(input: CourtMutationInput) {
  const providerId = await findProviderIdByOwner(input.ownerUserId);
  if (!providerId) throw new Error("Профиль владельца не найден");
  const sql = getDb();
  return sql.begin((transaction) => insertCourt(transaction, input, providerId));
}

export async function updateUnitWithRules(input: CourtMutationInput & { unitId: string }) {
  const sql = getDb();
  return sql.begin(async (transaction) => {
    const venueId = await updateOwnedUnit(transaction, input);
    await updateVenue(transaction, input, venueId);
    await replaceSchedule(transaction, input.unitId, input.schedule);
  });
}

export async function setOwnerUnitActive(input: {
  active: boolean;
  ownerUserId: string;
  unitId: string;
}) {
  const sql = getDb();
  const rows = await sql.unsafe<{ id: string }[]>(`
    UPDATE bookable_units u SET is_active = $1, updated_at = NOW()
    FROM venues v JOIN providers p ON p.id = v.provider_id
    WHERE u.id = $2 AND u.venue_id = v.id AND p.owner_user_id = $3
    RETURNING u.id
  `, [input.active, input.unitId, input.ownerUserId]);
  return Boolean(rows[0]);
}

async function findProviderIdByOwner(ownerUserId: string) {
  const sql = getDb();
  const [row] = await sql<{ id: string }[]>`
    SELECT id FROM providers WHERE owner_user_id = ${ownerUserId}
  `;
  return row?.id || null;
}

async function insertCourt(sql: CatalogDb, input: CourtMutationInput, providerId: string) {
  const venueId = createId();
  const unitId = createId();
  await insertVenue(sql, input, venueId, providerId);
  await insertUnit(sql, input, unitId, venueId);
  await insertSchedule(sql, unitId, input.schedule);
  return unitId;
}

async function insertVenue(
  sql: CatalogDb,
  input: CourtMutationInput,
  venueId: string,
  providerId: string
) {
  await sql.unsafe(`
    INSERT INTO venues (id, provider_id, city, title, address)
    VALUES ($1, $2, $3, $4, $5)
  `, [venueId, providerId, input.city, input.venueTitle, input.address]);
}

async function insertUnit(sql: CatalogDb, input: CourtMutationInput, unitId: string, venueId: string) {
  await sql.unsafe(`
    INSERT INTO bookable_units (
      id, venue_id, kind, title, surface, description, price_per_hour, slot_minutes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [unitId, venueId, input.kind, input.title, input.surface, input.description, input.pricePerHour, input.slotMinutes]);
}

async function updateOwnedUnit(sql: CatalogDb, input: CourtMutationInput & { unitId: string }) {
  const [row] = await sql.unsafe<{ venue_id: string }[]>(`
    UPDATE bookable_units u SET kind = $1, title = $2, surface = $3,
      description = $4, price_per_hour = $5, slot_minutes = $8, updated_at = NOW()
    FROM venues v JOIN providers p ON p.id = v.provider_id
    WHERE u.id = $6 AND u.venue_id = v.id AND p.owner_user_id = $7
    RETURNING u.venue_id
  `, [input.kind, input.title, input.surface, input.description,
    input.pricePerHour, input.unitId, input.ownerUserId, input.slotMinutes]);
  if (!row) throw new Error("Корт не найден");
  return row.venue_id;
}

async function updateVenue(sql: CatalogDb, input: CourtMutationInput, venueId: string) {
  await sql.unsafe(`
    UPDATE venues SET title = $1, city = $2, address = $3 WHERE id = $4
  `, [input.venueTitle, input.city, input.address, venueId]);
}

async function replaceSchedule(sql: CatalogDb, unitId: string, schedule: WeeklyScheduleEntry[]) {
  await sql.unsafe("DELETE FROM availability_rules WHERE unit_id = $1", [unitId]);
  await insertSchedule(sql, unitId, schedule);
}

async function insertSchedule(sql: CatalogDb, unitId: string, schedule: WeeklyScheduleEntry[]) {
  for (const rule of schedule) {
    await sql.unsafe(`
      INSERT INTO availability_rules (id, unit_id, weekday, start_minutes, end_minutes)
      VALUES ($1, $2, $3, $4, $5)
    `, [createId(), unitId, rule.weekday, toMinutes(rule.startTime), toMinutes(rule.endTime)]);
  }
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}
