"use server";

import { redirect } from "next/navigation";

import {
  changeAdminCatalogActive,
  editAdminCatalog
} from "@/features/admin/server/adminCatalogService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { readCourtFormData } from "@/features/catalog/server/catalogFormData";
import { getErrorMessage } from "@/features/shared/server/errors";
import { createFormParams, readFormFlag, readFormText } from "@/features/shared/server/formData";

export async function updateAdminCatalogAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readCatalogFilters(formData);
  const unitId = readFormText(formData, "unitId");
  try {
    await editAdminCatalog(admin, { ...readCourtFormData(formData), unitId });
    params.set("success", "Данные корта и расписание обновлены");
  } catch (error) {
    params.set("error", getErrorMessage(error, "Не удалось обновить объект"));
  }
  redirect(`/adminpanel/catalog/${encodeURIComponent(unitId)}?${params}`);
}

export async function toggleAdminCatalogAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readCatalogFilters(formData);
  try {
    await changeAdminCatalogActive(admin, { active: readFormFlag(formData, "active"), entityId: readFormText(formData, "entityId"), entityType: readFormText(formData, "entityType") });
    params.set("success", "Статус объекта обновлён");
  } catch (error) {
    params.set("error", getErrorMessage(error, "Не удалось обновить объект"));
  }
  redirect(`/adminpanel/catalog?${params}`);
}

function readCatalogFilters(formData: FormData) {
  return createFormParams(formData, { city: "filterCity", q: "search", status: "filterStatus" });
}
