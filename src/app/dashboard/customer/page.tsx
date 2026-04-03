import Link from "next/link";

import { requireUser } from "@/features/auth/server/requireUser";
import {
  getCustomerBookingList,
  getUpcomingCustomerBooking
} from "@/features/booking/server/bookingService";
import { BookingStatusBadge } from "@/features/booking/ui/BookingStatusBadge";
import { QuickSearchBar } from "@/features/booking/ui/QuickSearchBar";
import { UpcomingBookingCard } from "@/features/booking/ui/UpcomingBookingCard";
import s from "@/features/booking/ui/customer.module.css";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerMainPage(props: PageProps) {
  const user = await requireUser("customer");
  const sp = await props.searchParams;
  const error = pickValue(sp.error);
  const success = pickValue(sp.success);

  const [cities, upcoming, bookings] = await Promise.all([
    getCityOptions(),
    getUpcomingCustomerBooking(user.id),
    getCustomerBookingList(user.id)
  ]);

  const recent = bookings.slice(0, 3);

  return (
    <>
      <StatusBanner error={error} success={success} />

      <section className="panel">
        <div className={s.welcome}>
          <p className="eyebrow">Добро пожаловать</p>
          <h1>Привет, {user.fullName}!</h1>
        </div>
      </section>

      <section className="panel stack">
        <h2>Ближайшая бронь</h2>
        <UpcomingBookingCard booking={upcoming} />
      </section>

      <section className="panel stack">
        <h2>Быстрый поиск</h2>
        <QuickSearchBar cities={cities} />
      </section>

      {recent.length > 0 && (
        <section className="panel stack">
          <h2>Последние бронирования</h2>
          <div className={s.recentList}>
            {recent.map((item) => (
              <div key={item.bookingId} className={s.recentItem}>
                <div className={s.recentMeta}>
                  <strong>{item.venueTitle} / {item.unitTitle}</strong>
                  <span>{item.dateLabel}, {item.startTime} &ndash; {item.endTime}</span>
                </div>
                <BookingStatusBadge status={item.status} />
              </div>
            ))}
          </div>
          <Link
            className="secondary-link"
            href="/dashboard/customer/bookings"
            style={{ justifySelf: "start" }}
          >
            Все бронирования
          </Link>
        </section>
      )}
    </>
  );
}

function pickValue(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
