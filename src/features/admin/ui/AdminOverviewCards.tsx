import type { AdminOverviewStats } from "@/features/admin/server/adminTypes";
import { AdminStats } from "./shared/AdminStats";

export function AdminOverviewCards({ stats }: { stats: AdminOverviewStats }) {
  return <AdminStats items={[
    { label: "Пользователи", value: stats.users },
    { label: "Владельцы", value: stats.owners },
    { label: "Объекты", value: stats.venues },
    { label: "Корты", value: stats.units },
    { label: "Брони сегодня", value: stats.bookingsToday },
    { label: "Предстоящие", value: stats.upcomingBookings },
    { label: "Отменённые", value: stats.cancelledBookings }
  ]} />;
}
