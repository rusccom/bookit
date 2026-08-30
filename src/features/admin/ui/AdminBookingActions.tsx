import { AdminBookingStatusForm } from "@/features/admin/ui/AdminBookingStatusForm";

import styles from "./adminDataTable.module.css";

type AdminBookingActionsProps = {
  bookingId: string;
  bookingStatus: string;
  filterDate: string;
  filterStatus: string;
  search: string;
};

export function AdminBookingActions(props: AdminBookingActionsProps) {
  return <div className={styles.rowActions}>
    {props.bookingStatus !== "confirmed" && <AdminBookingStatusForm {...props} nextStatus="confirmed" />}
    {props.bookingStatus !== "cancelled" && <AdminBookingStatusForm {...props} nextStatus="cancelled" />}
  </div>;
}
