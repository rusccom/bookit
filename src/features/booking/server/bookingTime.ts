import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { isFutureBookingStart, parseTimeLabel } from "@/features/shared/server/dateTime";

export function isFutureBooking(booking: Pick<BookingRecord, "dateLabel" | "startTime">) {
  return isFutureBookingStart(booking.dateLabel, parseTimeLabel(booking.startTime));
}
