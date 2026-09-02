"use server";

import { redirect } from "next/navigation";

import {
  changeAdminCatalogActive,
  editAdminCatalog
} from "@/features/admin/server/adminCatalogService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { readCourtFormData } from "@/features/catalog/server/catalogFormData";

export async function updateAdminCatalogAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readFilters(formData);
  const unitId = String(formData.get("unitId") || "");
  try {
    await editAdminCatalog(admin, { ...readCourtFormData(formData), unitId });
    params.set("success", "Данные корта и расписание обновлены");
  } catch (error) {
    params.set("error", getMessage(error));
  }
  redirect(`/adminpanel/catalog/${encodeURIComponent(unitId)}?${params}`);
}

export async function toggleAdminCatalogAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readFilters(formData);
  try {
    await changeAdminCatalogActive(admin, { active: formData.get("active") === "true", entityId: String(formData.get("entityId") || ""), entityType: String(formData.get("entityType") || "") });
    params.set("success", "Статус объекта обновлён");
  } catch (error) {
    params.set("error", getMessage(error));
  }
  redirect(`/adminpanel/catalog?${params}`);
}

function readFilters(formData: FormData) {
  return new URLSearchParams({ city: String(formData.get("filterCity") || ""), q: String(formData.get("search") || ""), status: String(formData.get("filterStatus") || "") });
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось обновить объект";
}
