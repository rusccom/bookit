import { z } from "zod";

import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import {
  listAdminCatalog,
  setAdminCatalogActive,
  updateAdminCatalogItem
} from "@/features/admin/server/adminCatalogRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";

const catalogUpdateSchema = z.object({
  address: z.string().trim().min(5, "Укажите адрес").max(200),
  city: z.string().trim().min(2, "Укажите город").max(100),
  unitId: z.string().uuid(),
  unitTitle: z.string().trim().min(2, "Укажите название корта").max(100),
  venueId: z.string().uuid(),
  venueTitle: z.string().trim().min(2, "Укажите название объекта").max(100)
});

export async function getAdminCatalog(filters: {
  city: string;
  search: string;
  status: string;
}) {
  const parsed = z.enum(["active", "inactive"]).safeParse(filters.status);
  return listAdminCatalog({ ...filters, status: parsed.success ? parsed.data : "" });
}

export async function editAdminCatalog(
  admin: AdminAccount,
  input: z.input<typeof catalogUpdateSchema>
) {
  const values = parseCatalogUpdate(input);
  const changed = await updateAdminCatalogItem(values);
  if (!changed) throw new Error("Корт не найден");
  await createAdminAudit({ action: "update", admin, details: values, entityId: values.unitId, entityType: "catalog" });
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

function parseCatalogUpdate(input: z.input<typeof catalogUpdateSchema>) {
  const result = catalogUpdateSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);
  return result.data;
}
