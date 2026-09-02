import type { AdminUserBooking } from "@/features/admin/server/adminTypes";
import { AdminBookingBadge } from "./AdminBookingBadge";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

const columns: AdminColumn<AdminUserBooking>[] = [
  { key: "date", label: "Дата", render: (item) => item.date },
  { key: "time", label: "Время", render: (item) => item.time },
  { key: "venue", label: "Объект", render: (item) => item.venueTitle },
  { key: "unit", label: "Корт", render: (item) => item.unitTitle },
  { key: "status", label: "Статус", render: (item) => <AdminBookingBadge status={item.status} /> }
];

export function AdminUserBookingTable({ bookings }: { bookings: AdminUserBooking[] }) {
  return <AdminTable caption="История бронирований" columns={columns} items={bookings} rowKey={(item) => item.bookingId} emptyMessage="Связанных бронирований нет." />;
}
