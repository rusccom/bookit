import { requireUser } from "@/features/auth/server/requireUser";
import { getCustomerBookingList } from "@/features/booking/server/bookingService";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingHistoryList } from "@/features/booking/ui/BookingHistoryList";
import { isFutureBooking } from "@/features/booking/server/bookingTime";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CustomerBookingsPage(props: PageProps) {
  const user = await requireUser("customer");
  const sp = await props.searchParams;
  const tab = getSearchParam(sp.tab) || "upcoming";
  const error = getSearchParam(sp.error);
  const success = getSearchParam(sp.success);

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
    return items.filter((item) => item.status !== "cancelled" && !isFutureBooking(item));
  }
  return items.filter((item) => item.status !== "cancelled" && isFutureBooking(item));
}
