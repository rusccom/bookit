import { AdminBookingStatusForm } from "./AdminBookingStatusForm";
import { AdminActions } from "./shared/AdminActions";

type AdminBookingActionsProps = {
  bookingId: string;
  bookingStatus: string;
  filterDate: string;
  filterStatus: string;
  search: string;
};

export function AdminBookingActions({ bookingStatus, ...filters }: AdminBookingActionsProps) {
  return <AdminActions>
    {bookingStatus !== "confirmed" && <AdminBookingStatusForm {...filters} nextStatus="confirmed" />}
    {bookingStatus !== "cancelled" && <AdminBookingStatusForm {...filters} nextStatus="cancelled" />}
  </AdminActions>;
}
