import Link from "next/link";

import { cancelCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "@/features/booking/ui/BookingStatusBadge";
import { isFutureBookingStart, parseTimeLabel } from "@/features/shared/server/dateTime";
import styles from "./customer.module.css";
import calendarStyles from "./bookingCalendar.module.css";

export function CustomerBookingHistoryCard({ item }: { item: BookingRecord }) {
  const canCancel = item.status !== "cancelled" && isFuture(item);
  return <article className={styles.historyCard}>
    <div><h3>{item.venueTitle} / {item.unitTitle}</h3><p>{item.dateLabel}, {item.startTime}–{item.endTime}</p><p className="muted">{item.city}, {item.address}</p><BookingStatusBadge status={item.status} />{item.note && <p>{item.note}</p>}</div>
    <div className={styles.historyActions}>
      {canCancel && <form action={cancelCustomerBookingAction}><input name="bookingId" type="hidden" value={item.bookingId} /><input name="returnTo" type="hidden" value="/dashboard/customer/bookings" /><button className="ghost-button" type="submit">Отменить</button></form>}
      {item.status === "confirmed" && isFuture(item) && <div className={calendarStyles.calendarAction}>
        <a className="ghost-button" download href={`/dashboard/customer/bookings/${item.bookingId}/calendar`}>В календарь (.ics)</a>
        <small>После отмены брони удалите событие из календаря вручную.</small>
      </div>}
      <Link className={styles.repeatLink} href={buildRepeatUrl(item)}>Повторить бронь</Link>
    </div>
  </article>;
}

function isFuture(item: BookingRecord) {
  return isFutureBookingStart(item.dateLabel, parseTimeLabel(item.startTime));
}

function buildRepeatUrl(item: BookingRecord): string {
  const params = new URLSearchParams({ city: item.city, venueQuery: item.venueTitle });
  return `/dashboard/customer/search?${params.toString()}`;
}
