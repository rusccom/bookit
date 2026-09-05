import { z } from "zod";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { getBookingForActor } from "@/features/booking/server/bookingQueryRepository";
import { bookingTimeToUtc, escapeCalendarText, foldCalendarLine, formatCalendarTimestamp } from "@/features/booking/server/bookingCalendarFormat";
import { isFutureBooking } from "@/features/booking/server/bookingTime";

export async function getCustomerBookingCalendar(input: { bookingId: string; customerUserId: string }) {
  if (!z.string().uuid().safeParse(input.bookingId).success) return null;
  const booking = await getBookingForActor({ actorRole: "customer", actorUserId: input.customerUserId, bookingId: input.bookingId });
  if (!booking || booking.status !== "confirmed" || !isFutureBooking(booking)) return null;
  return buildBookingCalendar(booking);
}

export function buildBookingCalendar(booking: BookingRecord) {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BookCort//Bookings//RU", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${booking.bookingId}@bookcort`, `DTSTAMP:${formatCalendarTimestamp(new Date())}`,
    `DTSTART:${bookingTimeToUtc(booking.dateLabel, booking.startTime)}`,
    `DTEND:${bookingTimeToUtc(booking.dateLabel, booking.endTime)}`,
    `SUMMARY:${escapeCalendarText(`${booking.venueTitle} / ${booking.unitTitle}`)}`,
    `LOCATION:${escapeCalendarText(`${booking.city}, ${booking.address}`)}`,
    `DESCRIPTION:${escapeCalendarText("Бронирование BookCort. Изменения и отмены проверяйте в личном кабинете.")}`,
    "STATUS:CONFIRMED", "TRANSP:OPAQUE", "END:VEVENT", "END:VCALENDAR"
  ];
  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}
