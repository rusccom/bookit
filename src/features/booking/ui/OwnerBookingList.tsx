"use client";

import { useState } from "react";

import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { isFutureBooking } from "@/features/booking/server/bookingTime";
import { OwnerBookingCard } from "@/features/booking/ui/OwnerBookingCard";
import { OwnerBookingTabs } from "@/features/booking/ui/OwnerBookingTabs";
import type { OwnerBookingTab } from "@/features/booking/ui/ownerBookingPresentation";
import shared from "./dashboardShared.module.css";

type OwnerBookingListProps = {
  items: BookingRecord[];
};

export function OwnerBookingList(props: OwnerBookingListProps) {
  const [tab, setTab] = useState<OwnerBookingTab>("upcoming");
  const filtered = props.items.filter((item) => matchesTab(item, tab));
  return <div className="stack">
    <OwnerBookingTabs active={tab} onChange={setTab} />
    {filtered.length === 0 && <div className={shared.emptyCard}><p>Нет бронирований</p></div>}
    {filtered.map((item) => <OwnerBookingCard key={item.bookingId} item={item} />)}
  </div>;
}

function matchesTab(item: BookingRecord, tab: OwnerBookingTab) {
  if (tab === "cancelled") return item.status === "cancelled";
  if (tab === "past") return !isFutureBooking(item) && item.status !== "cancelled";
  return isFutureBooking(item) && item.status !== "cancelled";
}
