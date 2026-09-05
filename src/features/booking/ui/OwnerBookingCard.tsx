import { cancelOwnerBookingAction } from "@/features/booking/server/bookingActions";
import { isFutureBooking } from "@/features/booking/server/bookingTime";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatBookingCustomer, formatBookingSource } from "./ownerBookingPresentation";
import s from "./owner.module.css";
import shared from "./dashboardShared.module.css";

export function OwnerBookingCard({ item }: { item: BookingRecord }) {
  const cancellable = item.status !== "cancelled" && isFutureBooking(item);
  return <div className={shared.recordCard}>
    <div className={s.bookingMeta}>
      <strong>{item.venueTitle} / {item.unitTitle}</strong>
      <span>{item.dateLabel}, {item.startTime} &ndash; {item.endTime}</span>
      <span>{item.city}, {item.address}</span><span>{formatBookingCustomer(item)}</span>
      {item.note && <span>{item.note}</span>}
    </div>
    <div className={s.bookingActions}>
      <BookingStatusBadge status={item.status} /><span className={s.sourceBadge}>{formatBookingSource(item.source)}</span>
      {cancellable && <form action={cancelOwnerBookingAction}>
        <input name="bookingId" type="hidden" value={item.bookingId} /><button className="ghost-button" type="submit">Отменить</button>
      </form>}
    </div>
  </div>;
}
