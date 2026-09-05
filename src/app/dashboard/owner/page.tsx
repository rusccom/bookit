import { requireUser } from "@/features/auth/server/requireUser";
import { getOwnerDashboardStats, getOwnerTodayBookings } from "@/features/booking/server/bookingService";
import { OwnerQuickActions } from "@/features/booking/ui/OwnerQuickActions";
import { OwnerStatCards } from "@/features/booking/ui/OwnerStatCards";
import { TodaySchedule } from "@/features/booking/ui/TodaySchedule";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getTodayIso } from "@/features/shared/server/dateTime";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function OwnerOverviewPage(props: PageProps) {
  const owner = await requireUser("owner");
  const sp = await props.searchParams;
  const today = getTodayIso();
  const [stats, todayBookings] = await Promise.all([
    getOwnerDashboardStats(owner.id, today),
    getOwnerTodayBookings(owner.id, today)
  ]);
  return <>
    <StatusBanner error={getSearchParam(sp.error)} success={getSearchParam(sp.success)} />
    <OwnerStatCards nextBookingLabel={todayBookings[0]?.startTime || null}
      todayCount={stats.todayCount} totalUnits={stats.totalUnits} />
    <section className="panel stack">
      <h2>Расписание на сегодня</h2>
      <TodaySchedule bookings={todayBookings} />
    </section>
    <OwnerQuickActions />
  </>;
}
