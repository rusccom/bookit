"use server";

import { redirect } from "next/navigation";

import {
  changeAdminCatalogActive,
  editAdminCatalog
} from "@/features/admin/server/adminCatalogService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";

export async function updateAdminCatalogAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readFilters(formData);
  try {
    await editAdminCatalog(admin, readUpdate(formData));
    params.set("success", "Данные объекта обновлены");
  } catch (error) {
    params.set("error", getMessage(error));
  }
  redirect(`/adminpanel/catalog?${params}`);
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

function readUpdate(formData: FormData) {
  return { address: String(formData.get("address") || ""), city: String(formData.get("city") || ""), unitId: String(formData.get("unitId") || ""), unitTitle: String(formData.get("unitTitle") || ""), venueId: String(formData.get("venueId") || ""), venueTitle: String(formData.get("venueTitle") || "") };
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось обновить объект";
}
