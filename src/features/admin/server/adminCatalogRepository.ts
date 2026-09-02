import type { Row } from "postgres";

import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { ADMIN_CATALOG_ATTENTION_QUERY, ADMIN_CATALOG_QUERY } from "@/features/admin/server/adminCatalogSql";
import { findOwnerUnitDetails } from "@/features/catalog/server/catalogQueryRepository";
import type { SlotMinutes } from "@/features/catalog/slotOptions";
import { getDb } from "@/features/database/server/client";

type CatalogRow = Row & {
  address: string; city: string; is_unit_active: boolean; is_venue_active: boolean;
  owner_id: string; owner_name: string; price_per_hour: string; scheduled_days: number;
  slot_minutes: SlotMinutes; unit_id: string; unit_title: string; venue_id: string; venue_title: string;
};

export async function listAdminCatalog(filters: { city: string; search: string; status: string }): Promise<AdminCatalogRecord[]> {
  const query = filters.search.trim();
  const rows = await getDb().unsafe<CatalogRow[]>(ADMIN_CATALOG_QUERY, [filters.city, filters.status, query, `%${query}%`]);
  return rows.map(mapCatalog);
}

export async function getAdminCatalogAttention() {
  const [row] = await getDb().unsafe<{ no_schedule: number; no_price: number }[]>(ADMIN_CATALOG_ATTENTION_QUERY);
  return { noSchedule: row.no_schedule, noPrice: row.no_price };
}

export async function findAdminCourtDetails(unitId: string) {
  const sql = getDb();
  const [row] = await sql<{ owner_user_id: string; owner_name: string }[]>`
    SELECT p.owner_user_id, o.full_name AS owner_name FROM bookable_units u
    JOIN venues v ON v.id = u.venue_id JOIN providers p ON p.id = v.provider_id
    JOIN app_users o ON o.id = p.owner_user_id WHERE u.id = ${unitId}
  `;
  if (!row) return null;
  const unit = await findOwnerUnitDetails({ ownerUserId: row.owner_user_id, unitId });
  return unit ? { ownerUserId: row.owner_user_id, ownerName: row.owner_name, unit } : null;
}

export async function setAdminCatalogActive(input: { active: boolean; entityId: string; entityType: "unit" | "venue" }) {
  const table = input.entityType === "unit" ? "bookable_units" : "venues";
  const rows = await getDb().unsafe<{ id: string }[]>(
    `UPDATE ${table} SET is_active = $1 WHERE id = $2 RETURNING id`, [input.active, input.entityId]
  );
  return Boolean(rows[0]);
}

function mapCatalog(row: CatalogRow): AdminCatalogRecord {
  return {
    address: row.address, city: row.city, isUnitActive: row.is_unit_active,
    isVenueActive: row.is_venue_active, ownerName: row.owner_name, ownerId: row.owner_id,
    pricePerHour: Number(row.price_per_hour), scheduledDays: row.scheduled_days,
    slotMinutes: row.slot_minutes, unitId: row.unit_id, unitTitle: row.unit_title,
    venueId: row.venue_id, venueTitle: row.venue_title
  };
}
