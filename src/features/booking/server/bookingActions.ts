'use server';

import { redirect } from "next/navigation";

import { requireUser } from "@/features/auth/server/requireUser";
import {
  cancelBooking,
  createCustomerBooking,
  createOwnerManualBooking
} from "@/features/booking/server/bookingService";

export async function createCustomerBookingAction(formData: FormData) {
  const user = await requireUser("customer");
  let target = "/dashboard/customer";

  try {
    await createCustomerBooking({
      date: String(formData.get("date") || ""),
      durationMinutes: Number(formData.get("durationMinutes") || 0),
      note: String(formData.get("note") || ""),
      startTime: String(formData.get("startTime") || ""),
      unitId: String(formData.get("unitId") || ""),
      userId: user.id
    });
    target = "/dashboard/customer?success=booking-created";
  } catch (error) {
    target = `/dashboard/customer?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

export async function createOwnerManualBookingAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = "/dashboard/owner";

  try {
    await createOwnerManualBooking({
      date: String(formData.get("date") || ""),
      endTime: String(formData.get("endTime") || ""),
      note: String(formData.get("note") || ""),
      ownerUserId: owner.id,
      startTime: String(formData.get("startTime") || ""),
      unitId: String(formData.get("unitId") || "")
    });
    target = "/dashboard/owner?success=manual-booking-created";
  } catch (error) {
    target = `/dashboard/owner?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

export async function cancelCustomerBookingAction(formData: FormData) {
  const user = await requireUser("customer");
  await cancelBookingAction({
    actorRole: "customer",
    actorUserId: user.id,
    bookingId: String(formData.get("bookingId") || ""),
    redirectPath: "/dashboard/customer"
  });
}

export async function cancelOwnerBookingAction(formData: FormData) {
  const owner = await requireUser("owner");
  await cancelBookingAction({
    actorRole: "owner",
    actorUserId: owner.id,
    bookingId: String(formData.get("bookingId") || ""),
    redirectPath: "/dashboard/owner"
  });
}

async function cancelBookingAction(input: {
  actorRole: "customer" | "owner";
  actorUserId: string;
  bookingId: string;
  redirectPath: string;
}) {
  let target = input.redirectPath;

  try {
    await cancelBooking(input);
    target = `${input.redirectPath}?success=booking-cancelled`;
  } catch (error) {
    target = `${input.redirectPath}?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error";
}
