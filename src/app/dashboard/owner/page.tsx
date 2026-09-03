import { requireUser } from "@/features/auth/server/requireUser";
import { getOwnerDashboardStats, getOwnerTodayBookings } from "@/features/booking/server/bookingService";
import { OwnerQuickActions } from "@/features/booking/ui/OwnerQuickActions";
import { OwnerStatCards } from "@/features/booking/ui/OwnerStatCards";
import { TodaySchedule } from "@/features/booking/ui/TodaySchedule";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getTodayIso } from "@/features/shared/server/dateTime";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
    <StatusBanner error={pickValue(sp.error)} success={pickValue(sp.success)} />
    <OwnerStatCards nextBookingLabel={todayBookings[0]?.startTime || null}
      todayCount={stats.todayCount} totalUnits={stats.totalUnits} />
    <section className="panel stack">
      <h2>Расписание на сегодня</h2>
      <TodaySchedule bookings={todayBookings} />
    </section>
    <OwnerQuickActions />
  </>;
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
