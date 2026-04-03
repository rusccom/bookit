import Link from "next/link";

import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "@/features/booking/ui/BookingStatusBadge";
import s from "./owner.module.css";

type TodayScheduleProps = {
  bookings: BookingRecord[];
};

export function TodaySchedule(props: TodayScheduleProps) {
  if (props.bookings.length === 0) {
    return (
      <div className={s.emptyCard}>
        <p>На сегодня бронирований нет</p>
        <Link className="secondary-link" href="/dashboard/owner/bookings">
          Создать бронь
        </Link>
      </div>
    );
  }

  return (
    <div className={s.scheduleList}>
      {props.bookings.map((item) => (
        <div key={item.bookingId} className={s.scheduleItem}>
          <span className={s.scheduleTime}>
            {item.startTime}&ndash;{item.endTime}
          </span>
          <div className={s.scheduleMeta}>
            <strong>{item.venueTitle} / {item.unitTitle}</strong>
            <span>{item.source === "owner_manual" ? "Ручная бронь" : "Клиент"}</span>
          </div>
          <BookingStatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}
