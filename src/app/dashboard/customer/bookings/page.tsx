import { requireUser } from "@/features/auth/server/requireUser";
import { getCustomerBookingList } from "@/features/booking/server/bookingService";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { BookingHistoryList } from "@/features/booking/ui/BookingHistoryList";
import { toIsoDateLabel } from "@/features/shared/server/dateTime";
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
  const today = toIsoDateLabel(new Date());
  const filtered = filterByTab(all, tab, today);

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

function filterByTab(items: BookingRecord[], tab: string, today: string) {
  if (tab === "cancelled") {
    return items.filter((i) => i.status === "cancelled");
  }
  if (tab === "past") {
    return items.filter((i) => i.status !== "cancelled" && i.dateLabel < today);
  }
  return items.filter((i) => i.status !== "cancelled" && i.dateLabel >= today);
}

function pick(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
