import type { AdminBookingRecord } from "@/features/admin/server/adminTypes";
import { formatBelarusPhone } from "@/features/shared/server/phone";
import { AdminBookingActions } from "./AdminBookingActions";
import { AdminBookingBadge } from "./AdminBookingBadge";
import { AdminCell } from "./shared/AdminCell";
import { AdminTable, type AdminColumn } from "./shared/AdminTable";

type AdminBookingsTableProps = { bookings: AdminBookingRecord[]; date: string; search: string; status: string };

export function AdminBookingsTable({ bookings, date, search, status }: AdminBookingsTableProps) {
  const columns: AdminColumn<AdminBookingRecord>[] = [
    { key: "date", label: "Дата и время", render: (item) => <AdminCell detail={item.time}><strong>{item.date}</strong></AdminCell> },
    { key: "customer", label: "Клиент", render: (item) => <AdminCell detail={formatBelarusPhone(item.customerPhone) || "Телефон не указан"}>{item.customerName}</AdminCell> },
    { key: "venue", label: "Объект", render: (item) => <AdminCell detail={item.unitTitle}>{item.venueTitle}</AdminCell> },
    { key: "owner", label: "Владелец", render: (item) => item.ownerName },
    { key: "status", label: "Статус", render: (item) => <AdminBookingBadge status={item.status} /> },
    { key: "actions", label: "Управление", render: (item) => <AdminBookingActions bookingId={item.bookingId} bookingStatus={item.status} filterDate={date} filterStatus={status} search={search} /> }
  ];
  return <AdminTable caption="Бронирования" columns={columns} items={bookings} rowKey={(item) => item.bookingId} emptyMessage="Бронирования не найдены." />;
}
