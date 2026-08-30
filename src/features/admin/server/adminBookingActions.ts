"use server";

import { redirect } from "next/navigation";

import { changeAdminBookingStatus } from "@/features/admin/server/adminBookingService";
import { requireAdmin } from "@/features/admin/server/requireAdmin";

export async function updateAdminBookingStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const params = readFilters(formData);
  try {
    await changeAdminBookingStatus(admin, String(formData.get("bookingId") || ""), String(formData.get("status") || ""));
    params.set("success", "Статус бронирования обновлён");
  } catch (error) {
    params.set("error", getMessage(error));
  }
  redirect(`/adminpanel/bookings?${params}`);
}

function readFilters(formData: FormData) {
  return new URLSearchParams({
    date: String(formData.get("filterDate") || ""),
    q: String(formData.get("search") || ""),
    status: String(formData.get("filterStatus") || "")
  });
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось обновить бронирование";
}
