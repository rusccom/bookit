import type { Row } from "postgres";

import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { getDb } from "@/features/database/server/client";

type CatalogRow = Row & {
  address: string;
  city: string;
  is_unit_active: boolean;
  is_venue_active: boolean;
  owner_name: string;
  unit_id: string;
  unit_title: string;
  venue_id: string;
  venue_title: string;
};

type CatalogUpdate = {
  address: string;
  city: string;
  unitId: string;
  unitTitle: string;
  venueId: string;
  venueTitle: string;
};

export async function listAdminCatalog(filters: {
  city: string;
  search: string;
  status: string;
}): Promise<AdminCatalogRecord[]> {
  const sql = getDb();
  const query = filters.search.trim();
  const rows = await sql<CatalogRow[]>`
    SELECT u.id AS unit_id, u.title AS unit_title, u.is_active AS is_unit_active,
           v.id AS venue_id, v.title AS venue_title, v.city, v.address,
           v.is_active AS is_venue_active, o.full_name AS owner_name
    FROM bookable_units u
    JOIN venues v ON v.id = u.venue_id
    JOIN providers p ON p.id = v.provider_id
    JOIN app_users o ON o.id = p.owner_user_id
    WHERE (${filters.city} = '' OR v.city ILIKE ${filters.city})
      AND (${filters.status} = '' OR (${filters.status} = 'active' AND v.is_active AND u.is_active)
        OR (${filters.status} = 'inactive' AND (NOT v.is_active OR NOT u.is_active)))
      AND (${query} = '' OR u.title ILIKE ${`%${query}%`}
        OR v.title ILIKE ${`%${query}%`} OR o.full_name ILIKE ${`%${query}%`}
        OR v.address ILIKE ${`%${query}%`})
    ORDER BY v.city, v.title, u.title LIMIT 300
  `;
  return rows.map(mapCatalog);
}

export async function updateAdminCatalogItem(input: CatalogUpdate) {
  const sql = getDb();
  return sql.begin(async (transaction) => {
    await transaction`UPDATE venues SET title = ${input.venueTitle}, city = ${input.city}, address = ${input.address} WHERE id = ${input.venueId}`;
    const rows = await transaction<{ id: string }[]>`UPDATE bookable_units SET title = ${input.unitTitle} WHERE id = ${input.unitId} AND venue_id = ${input.venueId} RETURNING id`;
    if (!rows[0]) throw new Error("Корт не найден");
    return true;
  });
}

export async function setAdminCatalogActive(input: {
  active: boolean;
  entityId: string;
  entityType: "unit" | "venue";
}) {
  const sql = getDb();
  const table = input.entityType === "unit" ? "bookable_units" : "venues";
  const rows = await sql.unsafe<{ id: string }[]>(
    `UPDATE ${table} SET is_active = $1 WHERE id = $2 RETURNING id`,
    [input.active, input.entityId]
  );
  return Boolean(rows[0]);
}

function mapCatalog(row: CatalogRow): AdminCatalogRecord {
  return {
    address: row.address,
    city: row.city,
    isUnitActive: row.is_unit_active,
    isVenueActive: row.is_venue_active,
    ownerName: row.owner_name,
    unitId: row.unit_id,
    unitTitle: row.unit_title,
    venueId: row.venue_id,
    venueTitle: row.venue_title
  };
}
