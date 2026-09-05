"use server";

import { redirect } from "next/navigation";

import { changeAdminBookingStatus } from "@/features/admin/server/adminBookingService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { getErrorMessage } from "@/features/shared/server/errors";
import { createFormParams, readFormText } from "@/features/shared/server/formData";

export async function updateAdminBookingStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readBookingFilters(formData);
  try {
    await changeAdminBookingStatus(admin, readFormText(formData, "bookingId"), readFormText(formData, "status"));
    params.set("success", "Статус бронирования обновлён");
  } catch (error) {
    params.set("error", getErrorMessage(error, "Не удалось обновить бронирование"));
  }
  redirect(`/adminpanel/bookings?${params}`);
}

function readBookingFilters(formData: FormData) {
  return createFormParams(formData, { date: "filterDate", q: "search", status: "filterStatus" });
}
