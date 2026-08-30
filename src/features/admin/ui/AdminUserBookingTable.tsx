import type { AdminUserBooking } from "@/features/admin/server/adminTypes";

import styles from "./adminUserDetails.module.css";

type AdminUserBookingTableProps = {
  bookings: AdminUserBooking[];
};

export function AdminUserBookingTable({ bookings }: AdminUserBookingTableProps) {
  if (!bookings.length) return <p className={styles.empty}>Связанных бронирований нет.</p>;
  return <div className={styles.tableFrame}><table><thead><tr><th>Дата</th><th>Время</th><th>Объект</th><th>Корт</th><th>Статус</th></tr></thead><tbody>
    {bookings.map((item) => <tr key={item.bookingId}><td>{item.date}</td><td>{item.time}</td><td>{item.venueTitle}</td><td>{item.unitTitle}</td><td>{translateStatus(item.status)}</td></tr>)}
  </tbody></table></div>;
}

function translateStatus(status: string) {
  if (status === "confirmed") return "Подтверждено";
  if (status === "cancelled") return "Отменено";
  return "Ожидает подтверждения";
}
