import type { Row } from "postgres";
import type { SlotMinutes } from "@/features/catalog/slotOptions";
import type { AdminCatalogRecord, AdminUserCatalogItem } from "./adminTypes";

export type AdminCatalogBaseRow = Row & {
  city: string; is_active?: boolean; unit_id: string; unit_title: string; venue_title: string;
};

export type AdminCatalogRow = AdminCatalogBaseRow & {
  address: string; is_unit_active: boolean; is_venue_active: boolean; owner_id: string;
  owner_name: string; price_per_hour: string; scheduled_days: number;
  slot_minutes: SlotMinutes; venue_id: string;
};

export function mapAdminUserCatalog(row: AdminCatalogBaseRow): AdminUserCatalogItem {
  return {
    city: row.city, isActive: Boolean(row.is_active), unitId: row.unit_id,
    unitTitle: row.unit_title, venueTitle: row.venue_title
  };
}

export function mapAdminCatalogRecord(row: AdminCatalogRow): AdminCatalogRecord {
  return {
    address: row.address, city: row.city, isUnitActive: row.is_unit_active,
    isVenueActive: row.is_venue_active, ownerName: row.owner_name, ownerId: row.owner_id,
    pricePerHour: Number(row.price_per_hour), scheduledDays: row.scheduled_days,
    slotMinutes: row.slot_minutes, unitId: row.unit_id, unitTitle: row.unit_title,
    venueId: row.venue_id, venueTitle: row.venue_title
  };
}
