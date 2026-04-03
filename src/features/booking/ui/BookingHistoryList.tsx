import Link from "next/link";

import { cancelCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "./BookingStatusBadge";
import s from "./customer.module.css";

type Props = {
  activeTab: string;
  items: BookingRecord[];
};

const tabs = [
  { key: "upcoming", label: "Предстоящие" },
  { key: "past", label: "Прошедшие" },
  { key: "cancelled", label: "Отмененные" },
];

export function BookingHistoryList({ activeTab, items }: Props) {
  return (
    <div className="stack">
      <div className={s.filterTabs}>
        {tabs.map((tab) => {
          const cls = tab.key === activeTab
            ? `${s.filterTab} ${s.filterTabActive}`
            : s.filterTab;
          return (
            <Link key={tab.key} className={cls} href={`/dashboard/customer/bookings?tab=${tab.key}`}>
              {tab.label}
            </Link>
          );
        })}
      </div>
      {items.length ? items.map((item) => (
        <HistoryCard key={item.bookingId} item={item} />
      )) : (
        <p className="muted">Бронирований в этой категории нет.</p>
      )}
    </div>
  );
}

function HistoryCard({ item }: { item: BookingRecord }) {
  return (
    <article className={s.historyCard}>
      <div>
        <h3>{item.venueTitle} / {item.unitTitle}</h3>
        <p>{item.dateLabel}, {item.startTime} &ndash; {item.endTime}</p>
        <p className="muted">{item.city}, {item.address}</p>
        <BookingStatusBadge status={item.status} />
        {item.note && <p>{item.note}</p>}
      </div>
      <div className={s.historyActions}>
        {item.status !== "cancelled" && (
          <form action={cancelCustomerBookingAction}>
            <input name="bookingId" type="hidden" value={item.bookingId} />
            <input name="returnTo" type="hidden" value="/dashboard/customer/bookings" />
            <button className="ghost-button" type="submit">Отменить</button>
          </form>
        )}
        <Link className={s.repeatLink} href={buildRepeatUrl(item)}>
          Повторить бронь
        </Link>
      </div>
    </article>
  );
}

function buildRepeatUrl(item: BookingRecord): string {
  const params = new URLSearchParams({ city: item.city, venueQuery: item.venueTitle });
  return `/dashboard/customer/search?${params.toString()}`;
}
