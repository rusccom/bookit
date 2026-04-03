import Link from "next/link";

import { cancelCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "./BookingStatusBadge";
import s from "./customer.module.css";

type Props = { booking: BookingRecord | null };

export function UpcomingBookingCard({ booking }: Props) {
  if (!booking) {
    return (
      <div className={s.emptyCard}>
        <p>У вас пока нет предстоящих бронирований</p>
        <Link className="primary-link" href="/dashboard/customer/search">
          Забронировать корт
        </Link>
      </div>
    );
  }

  return (
    <div className={s.upcomingCard}>
      <div className={s.upcomingMeta}>
        <span className={s.upcomingDate}>
          {booking.dateLabel}, {booking.startTime} &ndash; {booking.endTime}
        </span>
        <span className={s.upcomingVenue}>
          {booking.venueTitle} / {booking.unitTitle}
        </span>
        <span className={s.upcomingAddress}>
          {booking.city}, {booking.address}
        </span>
        <BookingStatusBadge status={booking.status} />
      </div>
      <form action={cancelCustomerBookingAction}>
        <input name="bookingId" type="hidden" value={booking.bookingId} />
        <input name="returnTo" type="hidden" value="/dashboard/customer" />
        <button className="ghost-button" type="submit">Отменить</button>
      </form>
    </div>
  );
}
