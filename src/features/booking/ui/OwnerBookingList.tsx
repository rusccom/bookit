"use client";

import { useState } from "react";

import { cancelOwnerBookingAction } from "@/features/booking/server/bookingActions";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingStatusBadge } from "@/features/booking/ui/BookingStatusBadge";
import s from "./owner.module.css";

type Tab = "upcoming" | "past" | "cancelled";

type OwnerBookingListProps = {
  items: BookingRecord[];
};

export function OwnerBookingList(props: OwnerBookingListProps) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const today = new Date().toISOString().slice(0, 10);

  const filtered = props.items.filter((item) => {
    if (tab === "cancelled") return item.status === "cancelled";
    if (tab === "past") return item.dateLabel < today && item.status !== "cancelled";
    return item.dateLabel >= today && item.status !== "cancelled";
  });

  return (
    <div className="stack">
      <div className={s.filterTabs}>
        {renderTab("upcoming", "Предстоящие")}
        {renderTab("past", "Прошедшие")}
        {renderTab("cancelled", "Отменённые")}
      </div>

      {filtered.length === 0 && (
        <div className={s.emptyCard}>
          <p>Нет бронирований</p>
        </div>
      )}

      {filtered.map((item) => (
        <div key={item.bookingId} className={s.bookingCard}>
          <div className={s.bookingMeta}>
            <strong>{item.venueTitle} / {item.unitTitle}</strong>
            <span>
              {item.dateLabel}, {item.startTime} &ndash; {item.endTime}
            </span>
            <span>{item.city}, {item.address}</span>
            {item.note && <span>{item.note}</span>}
          </div>
          <div className={s.bookingActions}>
            <BookingStatusBadge status={item.status} />
            <span className={s.sourceBadge}>{formatSource(item.source)}</span>
            {item.status !== "cancelled" && (
              <form action={cancelOwnerBookingAction}>
                <input name="bookingId" type="hidden" value={item.bookingId} />
                <button className="ghost-button" type="submit">
                  Отменить
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  function renderTab(value: Tab, label: string) {
    const cls = tab === value
      ? `${s.filterTab} ${s.filterTabActive}`
      : s.filterTab;
    return (
      <button className={cls} onClick={() => setTab(value)} type="button">
        {label}
      </button>
    );
  }
}

function formatSource(source: string) {
  if (source === "owner_manual") return "Вручную";
  if (source === "telegram_llm") return "Telegram";
  return "Онлайн";
}
