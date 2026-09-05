import Link from "next/link";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "./BookingStatusBadge";
import s from "./customer.module.css";

export function RecentBookingsSection({ items }: { items: BookingRecord[] }) {
  if (!items.length) return null;
  return <section className="panel stack">
    <h2>Последние бронирования</h2>
    <div className={s.recentList}>
      {items.map((item) => <div key={item.bookingId} className={s.recentItem}>
        <div className={s.recentMeta}>
          <strong>{item.venueTitle} / {item.unitTitle}</strong>
          <span>{item.dateLabel}, {item.startTime} &ndash; {item.endTime}</span>
        </div>
        <BookingStatusBadge status={item.status} />
      </div>)}
    </div>
    <Link className="secondary-link" href="/dashboard/customer/bookings" style={{ justifySelf: "start" }}>Все бронирования</Link>
  </section>;
}
