import Link from "next/link";

import { requireUser } from "@/features/auth/server/requireUser";
import {
  getOwnerDashboardStats,
  getOwnerTodayBookings,
} from "@/features/booking/server/bookingService";
import { OwnerStatCards } from "@/features/booking/ui/OwnerStatCards";
import { TodaySchedule } from "@/features/booking/ui/TodaySchedule";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { toIsoDateLabel } from "@/features/shared/server/dateTime";

import s from "@/features/booking/ui/owner.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OwnerOverviewPage(props: PageProps) {
  const owner = await requireUser("owner");
  const sp = await props.searchParams;
  const error = pickValue(sp.error);
  const success = pickValue(sp.success);

  const today = toIsoDateLabel(new Date());

  const [stats, todayBookings] = await Promise.all([
    getOwnerDashboardStats(owner.id, today),
    getOwnerTodayBookings(owner.id, today),
  ]);

  const nextBooking = todayBookings.length > 0
    ? `${todayBookings[0].startTime}`
    : null;

  return (
    <>
      <StatusBanner error={error} success={success} />

      <section className="panel">
        <p className="eyebrow">Workspace</p>
        <h1>Привет, {owner.fullName}!</h1>
      </section>

      <OwnerStatCards
        nextBookingLabel={nextBooking}
        todayCount={stats.todayCount}
        totalUnits={stats.totalUnits}
      />

      <section className="panel stack">
        <h2>Расписание на сегодня</h2>
        <TodaySchedule bookings={todayBookings} />
      </section>

      <div className={s.quickActions}>
        <Link className="primary-link" href="/dashboard/owner/units">
          Добавить объект
        </Link>
        <Link className="secondary-link" href="/dashboard/owner/bookings">
          Создать бронь
        </Link>
      </div>
    </>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
