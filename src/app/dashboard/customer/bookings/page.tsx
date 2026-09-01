import { requireUser } from "@/features/auth/server/requireUser";
import { getCustomerBookingList } from "@/features/booking/server/bookingService";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingHistoryList } from "@/features/booking/ui/BookingHistoryList";
import { isFutureBookingStart, parseTimeLabel } from "@/features/shared/server/dateTime";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerBookingsPage(props: PageProps) {
  const user = await requireUser("customer");
  const sp = await props.searchParams;
  const tab = pick(sp.tab) || "upcoming";
  const error = pick(sp.error);
  const success = pick(sp.success);

  const all = await getCustomerBookingList(user.id);
  const filtered = filterByTab(all, tab);

  return (
    <>
      <StatusBanner error={error} success={success} />
      <section className="panel stack">
        <h2>Мои бронирования</h2>
        <BookingHistoryList activeTab={tab} items={filtered} />
      </section>
    </>
  );
}

function filterByTab(items: BookingRecord[], tab: string) {
  if (tab === "cancelled") {
    return items.filter((i) => i.status === "cancelled");
  }
  if (tab === "past") {
    return items.filter((item) => item.status !== "cancelled" && !isUpcoming(item));
  }
  return items.filter((item) => item.status !== "cancelled" && isUpcoming(item));
}

function isUpcoming(item: BookingRecord) {
  return isFutureBookingStart(item.dateLabel, parseTimeLabel(item.startTime));
}

function pick(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
