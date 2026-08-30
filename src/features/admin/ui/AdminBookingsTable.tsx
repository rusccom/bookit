import type { AdminBookingRecord } from "@/features/admin/server/adminTypes";
import { AdminBookingActions } from "@/features/admin/ui/AdminBookingActions";
import { formatBelarusPhone } from "@/features/shared/server/phone";

import styles from "./adminDataTable.module.css";

type AdminBookingsTableProps = {
  bookings: AdminBookingRecord[];
  date: string;
  search: string;
  status: string;
};

export function AdminBookingsTable(props: AdminBookingsTableProps) {
  if (!props.bookings.length) return <div className={styles.empty}>Бронирования не найдены.</div>;
  return <div className={styles.tableFrame}><table><thead><tr><th>Дата и время</th><th>Клиент</th><th>Объект</th><th>Владелец</th><th>Статус</th><th>Управление</th></tr></thead><tbody>
    {props.bookings.map((item) => <tr key={item.bookingId}><td><strong>{item.date}</strong><span>{item.time}</span></td><td>{item.customerName}<span>{formatBelarusPhone(item.customerPhone) || "Телефон не указан"}</span></td><td>{item.venueTitle}<span>{item.unitTitle}</span></td><td>{item.ownerName}</td><td><b className={getStatusClass(item.status)}>{translateStatus(item.status)}</b></td><td><AdminBookingActions bookingId={item.bookingId} bookingStatus={item.status} filterDate={props.date} filterStatus={props.status} search={props.search} /></td></tr>)}
  </tbody></table></div>;
}

function translateStatus(status: string) {
  if (status === "confirmed") return "Подтверждено";
  if (status === "cancelled") return "Отменено";
  return "Ожидает";
}

function getStatusClass(status: string) {
  if (status === "confirmed") return styles.successBadge;
  if (status === "cancelled") return styles.dangerBadge;
  return styles.warningBadge;
}
