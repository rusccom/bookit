import { z } from "zod";

import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import {
  findAdminBookingSlot,
  listAdminBookings,
  setAdminBookingStatus
} from "@/features/admin/server/adminBookingRepository";
import type { AdminAccount } from "@/features/admin/server/adminTypes";
import {
  hasActiveOverlap,
  runBookingTransaction,
  updateBookingStatus
} from "@/features/booking/server/bookingMutationRepository";

const bookingIdSchema = z.string().uuid();
const bookingStatusSchema = z.enum(["confirmed", "cancelled"]);

export async function getAdminBookings(input: {
  date: string;
  search: string;
  status: string;
}) {
  const parsed = z.enum(["pending_confirmation", "confirmed", "cancelled"]).safeParse(input.status);
  return listAdminBookings({ ...input, status: parsed.success ? parsed.data : "" });
}

export async function changeAdminBookingStatus(
  admin: AdminAccount,
  bookingId: string,
  status: string
) {
  const id = bookingIdSchema.parse(bookingId);
  const nextStatus = bookingStatusSchema.parse(status);
  const changed = nextStatus === "confirmed"
    ? await confirmBooking(id)
    : await setAdminBookingStatus({ bookingId: id, status: nextStatus });
  if (!changed) throw new Error("Бронирование не найдено");
  await createAdminAudit({ action: `status:${nextStatus}`, admin, entityId: id, entityType: "booking" });
}

async function confirmBooking(bookingId: string) {
  const slot = await findAdminBookingSlot(bookingId);
  if (!slot) return false;
  await runBookingTransaction(slot.unit_id, async (sql) => {
    const overlap = await hasActiveOverlap({ bookingDate: slot.booking_date, bookingId, endMinutes: slot.end_minutes, sql, startMinutes: slot.start_minutes, unitId: slot.unit_id });
    if (overlap) throw new Error("Этот временной слот уже занят");
    await updateBookingStatus({ bookingId, sql, status: "confirmed" });
  });
  return true;
}
