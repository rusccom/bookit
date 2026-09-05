import { requireUser } from "@/features/auth/server/requireUser";
import {
  getCustomerBookingList,
  getUpcomingCustomerBooking
} from "@/features/booking/server/bookingService";
import { QuickSearchBar } from "@/features/booking/ui/QuickSearchBar";
import { UpcomingBookingCard } from "@/features/booking/ui/UpcomingBookingCard";
import { RecentBookingsSection } from "@/features/booking/ui/RecentBookingsSection";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CustomerMainPage(props: PageProps) {
  const user = await requireUser("customer");
  const sp = await props.searchParams;
  const [cities, upcoming, bookings] = await Promise.all([
    getCityOptions(),
    getUpcomingCustomerBooking(user.id),
    getCustomerBookingList(user.id)
  ]);
  return <>
      <StatusBanner error={getSearchParam(sp.error)} success={getSearchParam(sp.success)} />
      <section className="panel stack">
        <h2>Ближайшая бронь</h2><UpcomingBookingCard booking={upcoming} />
      </section>
      <section className="panel stack">
        <h2>Быстрый поиск</h2><QuickSearchBar cities={cities} />
      </section>
      <RecentBookingsSection items={bookings.slice(0, 3)} />
    </>;
}
