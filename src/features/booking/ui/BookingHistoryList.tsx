import Link from "next/link";

import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { CustomerBookingHistoryCard } from "@/features/booking/ui/CustomerBookingHistoryCard";
import shared from "./dashboardShared.module.css";

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
  return <div className="stack">
      <div className={shared.filterTabs}>
        {tabs.map((tab) => {
          const cls = tab.key === activeTab ? `${shared.filterTab} ${shared.filterTabActive}` : shared.filterTab;
          return <Link key={tab.key} className={cls} href={`/dashboard/customer/bookings?tab=${tab.key}`}>{tab.label}</Link>;
        })}
      </div>
      {items.length ? items.map((item) => <CustomerBookingHistoryCard key={item.bookingId} item={item} />) : <p className="muted">Бронирований в этой категории нет.</p>}
    </div>;
}
