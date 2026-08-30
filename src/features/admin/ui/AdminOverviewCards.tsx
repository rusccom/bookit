import type { AdminOverviewStats } from "@/features/admin/server/adminTypes";

import styles from "./adminWorkspace.module.css";

type AdminOverviewCardsProps = {
  stats: AdminOverviewStats;
};

export function AdminOverviewCards({ stats }: AdminOverviewCardsProps) {
  const cards = [
    ["Пользователи", stats.users], ["Владельцы", stats.owners],
    ["Объекты", stats.venues], ["Корты", stats.units],
    ["Брони сегодня", stats.bookingsToday], ["Предстоящие", stats.upcomingBookings],
    ["Отменённые", stats.cancelledBookings]
  ];
  return <div className={styles.statGrid}>{cards.map(([label, value]) => <article className={styles.statCard} key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>;
}
