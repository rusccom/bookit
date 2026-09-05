'use server';

import { redirect } from "next/navigation";

import { requireUser } from "@/features/auth/server/requireUser";
import {
  cancelBooking,
  createCustomerBooking,
  createOwnerManualBooking
} from "@/features/booking/server/bookingService";
import { getErrorMessage } from "@/features/shared/server/errors";
import { readFormNumber, readFormText } from "@/features/shared/server/formData";

export async function createCustomerBookingAction(formData: FormData) {
  const user = await requireUser("customer");
  const returnTo = safeCustomerPath(readFormText(formData, "returnTo"));
  let target = "/dashboard/customer/bookings?success=booking-created";

  try {
    await createCustomerBooking({
      date: readFormText(formData, "date"),
      durationMinutes: readFormNumber(formData, "durationMinutes"),
      note: readFormText(formData, "note"),
      startTime: readFormText(formData, "startTime"),
      unitId: readFormText(formData, "unitId"),
      userId: user.id
    });
  } catch (error) {
    target = appendStatus(returnTo, "error", getErrorMessage(error, "Не удалось создать бронирование"));
  }

  redirect(target);
}

export async function createOwnerManualBookingAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = "/dashboard/owner";

  try {
    await createOwnerManualBooking({
      date: readFormText(formData, "date"),
      endTime: readFormText(formData, "endTime"),
      note: readFormText(formData, "note"),
      ownerUserId: owner.id,
      startTime: readFormText(formData, "startTime"),
      unitId: readFormText(formData, "unitId")
    });
    target = "/dashboard/owner/bookings?success=manual-booking-created";
  } catch (error) {
    target = `/dashboard/owner/bookings?error=${encodeURIComponent(getErrorMessage(error, "Не удалось создать бронирование"))}`;
  }

  redirect(target);
}

export async function cancelCustomerBookingAction(formData: FormData) {
  const user = await requireUser("customer");
  const returnTo = readFormText(formData, "returnTo") || "/dashboard/customer";
  const safePath = returnTo.startsWith("/dashboard/customer") ? returnTo : "/dashboard/customer";
  await cancelBookingAction({
    actorRole: "customer",
    actorUserId: user.id,
    bookingId: readFormText(formData, "bookingId"),
    redirectPath: safePath
  });
}

export async function cancelOwnerBookingAction(formData: FormData) {
  const owner = await requireUser("owner");
  await cancelBookingAction({
    actorRole: "owner",
    actorUserId: owner.id,
    bookingId: readFormText(formData, "bookingId"),
    redirectPath: "/dashboard/owner/bookings"
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
    target = `${input.redirectPath}?error=${encodeURIComponent(getErrorMessage(error, "Не удалось отменить бронирование"))}`;
  }

  redirect(target);
}

function safeCustomerPath(value: string) {
  return value.startsWith("/dashboard/customer/search?")
    ? value
    : "/dashboard/customer/search";
}

function appendStatus(path: string, key: "error" | "success", value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}
