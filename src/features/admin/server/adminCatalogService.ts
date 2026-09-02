import { z } from "zod";

import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import {
  listAdminCatalog,
  setAdminCatalogActive,
  findAdminCourtDetails
} from "@/features/admin/server/adminCatalogRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import { updateOwnerUnit } from "@/features/catalog/server/catalogService";

type CatalogUpdate = Omit<Parameters<typeof updateOwnerUnit>[0], "ownerUserId">;

export async function getAdminCatalog(filters: {
  city: string;
  search: string;
  status: string;
}) {
  const parsed = z.enum(["active", "inactive", "no_schedule", "no_price"]).safeParse(filters.status);
  return listAdminCatalog({ ...filters, status: parsed.success ? parsed.data : "" });
}

export async function editAdminCatalog(
  admin: AdminAccount,
  input: CatalogUpdate
) {
  const unitId = z.string().uuid("Корт не найден").parse(input.unitId);
  const details = await findAdminCourtDetails(unitId);
  if (!details) throw new Error("Корт не найден");
  await updateOwnerUnit({ ...input, ownerUserId: details.ownerUserId, unitId });
  const audit = { title: input.title, city: input.city, slotMinutes: input.slotMinutes, pricePerHour: input.pricePerHour, schedule: JSON.stringify(input.schedule) };
  await createAdminAudit({ action: "update", admin, details: audit, entityId: unitId, entityType: "catalog" });
}

export async function changeAdminCatalogActive(
  admin: AdminAccount,
  input: { active: boolean; entityId: string; entityType: string }
) {
  const values = z.object({ active: z.boolean(), entityId: z.string().uuid(), entityType: z.enum(["unit", "venue"]) }).parse(input);
  const changed = await setAdminCatalogActive(values);
  if (!changed) throw new Error("Объект не найден");
  await createAdminAudit({ action: values.active ? "enable" : "disable", admin, entityId: values.entityId, entityType: values.entityType });
}
