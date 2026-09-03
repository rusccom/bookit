import Link from "next/link";
import { requireUser } from "@/features/auth/server/requireUser";
import { getOccupancyWeek } from "@/features/booking/server/ownerOccupancyDates";
import { getOwnerOccupancy } from "@/features/booking/server/ownerOccupancyService";
import { OwnerOccupancyFilters } from "@/features/booking/ui/OwnerOccupancyFilters";
import { OwnerOccupancySummary } from "@/features/booking/ui/OwnerOccupancySummary";
import { OwnerOccupancyTable } from "@/features/booking/ui/OwnerOccupancyTable";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import styles from "@/features/booking/ui/ownerOccupancy.module.css";

type Props = { searchParams: Promise<{ date?: string | string[] }> };

export default async function OwnerOccupancyPage(props: Props) {
  const owner = await requireUser("owner");
  const params = await props.searchParams;
  const week = getOccupancyWeek(Array.isArray(params.date) ? params.date[0] : params.date);
  const report = await getOwnerOccupancy(owner.id, week.days);
  return <section className={styles.page}>
    <Link className="secondary-link" href="/dashboard/owner">← Обзор владельца</Link>
    <header className={styles.intro}><p className="eyebrow">Планирование недели</p><h1>Загрузка кортов</h1><p>Активные корты по текущему расписанию. Учитываются брони и ручные резервы; отменённые и истёкшие резервы исключены. Частично занятый слот считается недоступным целиком. Это заполненность слотов, не отчёт о выручке или отыгранных часах.</p></header>
    <StatusBanner error={week.error} />
    <OwnerOccupancyFilters date={week.selected} />
    <OwnerOccupancySummary totals={report.totals} />
    <OwnerOccupancyTable days={week.days} items={report.items} />
  </section>;
}
